export interface AITriageResult {
  category: 'billing' | 'technical' | 'complaint' | 'general';
  urgency: 'low' | 'medium' | 'high';
  summary: string;
  draft_response: string;
  is_fallback: boolean;
  error_message?: string;
}

export async function runAITriage(rawRequest: string): Promise<AITriageResult> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Attempt live LLM call if an API key is available
  if (anthropicApiKey) {
    try {
      return await callAnthropicWithRetry(rawRequest, anthropicApiKey);
    } catch (err: any) {
      console.warn('Anthropic API failed, falling back to heuristic engine:', err?.message);
      return fallbackTriage(rawRequest, `Anthropic API error: ${err?.message || 'Unknown'}`);
    }
  }

  if (openAiApiKey) {
    try {
      return await callOpenAIWithRetry(rawRequest, openAiApiKey);
    } catch (err: any) {
      console.warn('OpenAI API failed, falling back to heuristic engine:', err?.message);
      return fallbackTriage(rawRequest, `OpenAI API error: ${err?.message || 'Unknown'}`);
    }
  }

  if (geminiApiKey) {
    try {
      return await callGeminiWithRetry(rawRequest, geminiApiKey);
    } catch (err: any) {
      console.warn('Gemini API failed, falling back to heuristic engine:', err?.message);
      return fallbackTriage(rawRequest, `Gemini API error: ${err?.message || 'Unknown'}`);
    }
  }

  // If no API key configured, use intelligent heuristic engine
  return fallbackTriage(rawRequest);
}

// Anthropic Claude implementation with 1 auto-retry
async function callAnthropicWithRetry(
  rawRequest: string,
  apiKey: string,
  attempt = 1
): Promise<AITriageResult> {
  try {
    const prompt = `You are a support triage assistant. Given a customer request, classify it and write a initial response.

Customer Request: "${rawRequest.replace(/"/g, '\\"')}"

Return ONLY valid JSON in this exact shape, with no markdown code blocks or extra text:
{
  "category": "billing" | "technical" | "general" | "complaint",
  "urgency": "low" | "medium" | "high",
  "summary": "<one concise sentence summarizing the core issue>",
  "draft_response": "<2 to 4 sentence professional, warm response acknowledging the issue without promising specific resolution times or inventing policies>"
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const contentText = data?.content?.[0]?.text || '';
    const cleanJson = contentText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      category: validateCategory(parsed.category),
      urgency: validateUrgency(parsed.urgency),
      summary: parsed.summary || 'Customer issue requires review.',
      draft_response: parsed.draft_response || 'Thank you for reaching out. We have logged your request and our support team is actively reviewing it.',
      is_fallback: false,
    };
  } catch (err) {
    if (attempt < 2) {
      console.log(`Anthropic call attempt ${attempt} failed. Retrying once...`);
      return callAnthropicWithRetry(rawRequest, apiKey, attempt + 1);
    }
    throw err;
  }
}

// OpenAI implementation with 1 auto-retry
async function callOpenAIWithRetry(
  rawRequest: string,
  apiKey: string,
  attempt = 1
): Promise<AITriageResult> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a support triage assistant. Classify the customer request into JSON with fields: category ("billing"|"technical"|"general"|"complaint"), urgency ("low"|"medium"|"high"), summary (1 sentence), draft_response (2-4 sentences).',
          },
          { role: 'user', content: rawRequest },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      category: validateCategory(parsed.category),
      urgency: validateUrgency(parsed.urgency),
      summary: parsed.summary || 'Customer issue logged.',
      draft_response: parsed.draft_response || 'Thank you for contacting us. We have received your inquiry and our team is examining the details.',
      is_fallback: false,
    };
  } catch (err) {
    if (attempt < 2) {
      return callOpenAIWithRetry(rawRequest, apiKey, attempt + 1);
    }
    throw err;
  }
}

// Gemini implementation with 1 auto-retry
async function callGeminiWithRetry(
  rawRequest: string,
  apiKey: string,
  attempt = 1
): Promise<AITriageResult> {
  try {
    const prompt = `Classify this customer request into strict JSON:
Request: "${rawRequest}"
Required JSON schema:
{
  "category": "billing" | "technical" | "general" | "complaint",
  "urgency": "low" | "medium" | "high",
  "summary": "1 sentence summary",
  "draft_response": "2-4 sentence polite initial reply"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      category: validateCategory(parsed.category),
      urgency: validateUrgency(parsed.urgency),
      summary: parsed.summary,
      draft_response: parsed.draft_response,
      is_fallback: false,
    };
  } catch (err) {
    if (attempt < 2) {
      return callGeminiWithRetry(rawRequest, apiKey, attempt + 1);
    }
    throw err;
  }
}

// Heuristic Fallback Classifier when offline or when LLM API is unavailable
function fallbackTriage(rawRequest: string, errorMessage?: string): AITriageResult {
  const text = rawRequest.toLowerCase();

  // Category determination
  let category: AITriageResult['category'] = 'general';
  if (
    text.includes('charge') ||
    text.includes('billing') ||
    text.includes('invoice') ||
    text.includes('refund') ||
    text.includes('payment') ||
    text.includes('card') ||
    text.includes('double billed') ||
    text.includes('overcharge')
  ) {
    category = 'billing';
  } else if (
    text.includes('error') ||
    text.includes('bug') ||
    text.includes('crash') ||
    text.includes('outage') ||
    text.includes('broken') ||
    text.includes('login') ||
    text.includes('auth') ||
    text.includes('api') ||
    text.includes('fail') ||
    text.includes('code') ||
    text.includes('stack')
  ) {
    category = 'technical';
  } else if (
    text.includes('furious') ||
    text.includes('unacceptable') ||
    text.includes('terrible') ||
    text.includes('lawyer') ||
    text.includes('manager') ||
    text.includes('cancel') ||
    text.includes('horrible') ||
    text.includes('worst') ||
    text.includes('complaint') ||
    text.includes('disappointed')
  ) {
    category = 'complaint';
  }

  // Urgency determination
  let urgency: AITriageResult['urgency'] = 'low';
  if (
    text.includes('immediately') ||
    text.includes('urgent') ||
    text.includes('asap') ||
    text.includes('outage') ||
    text.includes('down') ||
    text.includes('broken') ||
    text.includes('lawyer') ||
    text.includes('critical') ||
    text.includes('emergency')
  ) {
    urgency = 'high';
  } else if (
    text.includes('issue') ||
    text.includes('problem') ||
    text.includes('cannot') ||
    text.includes('delay') ||
    text.includes('error') ||
    text.includes('fail')
  ) {
    urgency = 'medium';
  }

  // Summary generation
  const summary = `Customer reported a ${urgency}-urgency ${category} issue: "${
    rawRequest.length > 80 ? rawRequest.slice(0, 80) + '...' : rawRequest
  }"`;

  // Draft response generation
  let draftResponse = '';
  switch (category) {
    case 'billing':
      draftResponse =
        'Thank you for bringing this billing inquiry to our attention. Our financial accounts team is investigating the charge history on your account. We will follow up shortly with a detailed resolution.';
      break;
    case 'technical':
      draftResponse =
        'We have logged your technical support issue and notified our engineering team. We are actively reviewing system diagnostics and will reach out with troubleshooting steps or a fix promptly.';
      break;
    case 'complaint':
      draftResponse =
        'We sincerely apologize for the frustration this experience has caused. Your complaint has been escalated to a Customer Success Lead who will personally review your file and get in touch with you right away.';
      break;
    default:
      draftResponse =
        'Thank you for contacting customer support. We have received your inquiry and assigned it to our general support team. We look forward to assisting you.';
      break;
  }

  return {
    category,
    urgency,
    summary,
    draft_response: draftResponse,
    is_fallback: true,
    error_message: errorMessage,
  };
}

function validateCategory(cat: any): AITriageResult['category'] {
  if (['billing', 'technical', 'complaint', 'general'].includes(cat)) {
    return cat;
  }
  return 'general';
}

function validateUrgency(urg: any): AITriageResult['urgency'] {
  if (['low', 'medium', 'high'].includes(urg)) {
    return urg;
  }
  return 'medium';
}
