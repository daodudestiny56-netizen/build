import { NextResponse } from 'next/server';
import { checkAndRunEscalations } from '@/lib/workflow';

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

    return NextResponse.json({
      success: true,
      threshold_seconds: thresholdSeconds,
      newly_escalated_count: newlyEscalated.length,
      newly_escalated: newlyEscalated,
    });
  } catch (err: any) {
    console.error('Error running SLA escalation check:', err);
    return NextResponse.json(
      { error: `Escalation check error: ${err?.message}` },
      { status: 500 }
    );
  }
}
