export interface SlackNotificationPayload {
  id: string;
  customer_id: string;
  raw_request: string;
  category: string;
  urgency: string;
  assigned_to: string;
  created_at: string;
  escalated_at: string;
}

export async function sendSlackEscalationNotification(
  caseInfo: SlackNotificationPayload
): Promise<{ success: boolean; simulated?: boolean; message?: string }> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const payload = {
    text: `[SLA BREACH ALERT] Ticket #${caseInfo.id} has been Escalated!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `SLA BREACH ALARM: Case #${caseInfo.id}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Urgency:* \`${caseInfo.urgency.toUpperCase()}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Category:* \`${caseInfo.category.toUpperCase()}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Assigned To:* ${caseInfo.assigned_to}`,
          },
          {
            type: 'mrkdwn',
            text: `*Escalated At:* ${new Date(caseInfo.escalated_at).toTimeString().split(' ')[0]} UTC`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Customer Request:*\n> "${caseInfo.raw_request.substring(0, 200)}${
            caseInfo.raw_request.length > 200 ? '...' : ''
          }"`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `TRIAGE 3D SLA Daemon | Immediate Response Required`,
          },
        ],
      },
    ],
  };

  if (!webhookUrl) {
    console.log(
      `[SLACK WEBHOOK MOCK] process.env.SLACK_WEBHOOK_URL is not set. Payload prepared for Case #${caseInfo.id}`
    );
    return {
      success: true,
      simulated: true,
      message: 'SLACK_WEBHOOK_URL unset. Webhook notification payload logged server-side.',
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Slack API returned status ${res.status}`);
    }

    return {
      success: true,
      simulated: false,
      message: `Slack notification sent for Case #${caseInfo.id}`,
    };
  } catch (err: any) {
    console.error(`Slack webhook failure for Case #${caseInfo.id}:`, err?.message);
    return {
      success: false,
      simulated: false,
      message: `Failed to post Slack notification: ${err?.message}`,
    };
  }
}
