import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { runAITriage } from '@/lib/ai';
import { getAssignee } from '@/lib/workflow';

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, raw_request } = body || {};

    // Validate inputs
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Validation Error: Customer name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.trim()) {
      return NextResponse.json(
        { error: 'Validation Error: A valid customer email is required.' },
        { status: 400 }
      );
    }

    if (!raw_request || typeof raw_request !== 'string' || !raw_request.trim()) {
      return NextResponse.json(
        { error: 'Validation Error: Request details text cannot be empty.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRequest = raw_request.trim();

    // 1. Customer Dedup by Email
    let customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(cleanEmail) as any;
    let isExistingCustomer = true;

    if (!customer) {
      isExistingCustomer = false;
      const customerId = generateId('cust');
      db.prepare(`
        INSERT INTO customers (id, name, email, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `).run(customerId, cleanName, cleanEmail);

      customer = { id: customerId, name: cleanName, email: cleanEmail };
    }

    // 2. AI Triage Classification & Response Drafting
    const triage = await runAITriage(cleanRequest);

    // 3. Routing & Urgent Flagging Logic
    const assignedTo = getAssignee(triage.category, triage.urgency);
    const isUrgentFlag = triage.urgency === 'high' ? 1 : 0;
    const caseId = generateId('case');

    // 4. Create Case Record in Database
    db.prepare(`
      INSERT INTO cases (
        id, customer_id, raw_request, category, urgency,
        ai_summary, ai_draft_response, assigned_to, status,
        is_urgent_flag, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, 'new',
        ?, datetime('now'), datetime('now')
      )
    `).run(
      caseId,
      customer.id,
      cleanRequest,
      triage.category,
      triage.urgency,
      triage.summary,
      triage.draft_response,
      assignedTo,
      isUrgentFlag
    );

    // 5. Create Audit Log Entries
    const insertAudit = db.prepare(`
      INSERT INTO audit_log (id, case_id, event, detail, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    insertAudit.run(
      generateId('aud'),
      caseId,
      'intake',
      `Request received from ${cleanName} (${cleanEmail})`
    );

    insertAudit.run(
      generateId('aud'),
      caseId,
      'classified',
      `AI Classified issue as Category: '${triage.category}', Urgency: '${triage.urgency}'`
    );

    insertAudit.run(
      generateId('aud'),
      caseId,
      'routed',
      `Auto-routed to team: '${assignedTo}'`
    );

    if (isUrgentFlag === 1) {
      insertAudit.run(
        generateId('aud'),
        caseId,
        'urgent_flag',
        'High Urgency Alert: Flagged for immediate priority review regardless of category'
      );
    }

    if (triage.is_fallback) {
      insertAudit.run(
        generateId('aud'),
        caseId,
        'ai_fallback',
        `AI API fallback engine engaged (${triage.error_message || 'offline mode'}) — flagged for manual review`
      );
    }

    return NextResponse.json({
      success: true,
      case_id: caseId,
      customer_id: customer.id,
      customer_is_existing: isExistingCustomer,
      category: triage.category,
      urgency: triage.urgency,
      summary: triage.summary,
      draft_response: triage.draft_response,
      assigned_to: assignedTo,
      is_urgent_flag: Boolean(isUrgentFlag),
      is_fallback: triage.is_fallback,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error processing intake:', err);
    return NextResponse.json(
      { error: `Internal Server Error: ${err?.message || 'Failed to process intake request'}` },
      { status: 500 }
    );
  }
}
