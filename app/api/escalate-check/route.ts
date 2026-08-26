import { NextResponse } from 'next/server';
import { checkAndRunEscalations } from '@/lib/workflow';
import { sendSlackEscalationNotification } from '@/lib/slack';

export async function POST(request: Request) {
  try {
    let thresholdSeconds = 60; // 60s demo SLA (represents 24h production SLA)

    try {
      const body = await request.json();
      if (body && typeof body.threshold_seconds === 'number' && body.threshold_seconds > 0) {
        thresholdSeconds = body.threshold_seconds;
      }
    } catch {
      // Body empty or optional
    }

    const newlyEscalated = checkAndRunEscalations(thresholdSeconds);

    // Dispatch Slack notifications asynchronously for all newly escalated tickets
    const slackResults = await Promise.all(
      newlyEscalated.map((item) => sendSlackEscalationNotification(item))
    );

    const hasSlackWebhook = !!process.env.SLACK_WEBHOOK_URL;

    return NextResponse.json({
      success: true,
      threshold_seconds: thresholdSeconds,
      newly_escalated_count: newlyEscalated.length,
      newly_escalated: newlyEscalated,
      slack_webhook_configured: hasSlackWebhook,
      slack_dispatch_results: slackResults,
    });
  } catch (err: any) {
    console.error('Error running SLA escalation check:', err);
    return NextResponse.json(
      { error: `Escalation check error: ${err?.message}` },
      { status: 500 }
    );
  }
}
