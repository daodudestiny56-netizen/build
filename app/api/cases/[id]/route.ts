import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;

    // Fetch case record with customer
    const caseItem = db
      .prepare(
        `
      SELECT 
        c.*,
        cust.name as customer_name,
        cust.email as customer_email,
        cust.created_at as customer_created_at
      FROM cases c
      JOIN customers cust ON c.customer_id = cust.id
      WHERE c.id = ?
    `
      )
      .get(caseId) as any;

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Fetch Audit Log for this case
    const auditTrail = db
      .prepare(
        `
      SELECT * FROM audit_log
      WHERE case_id = ?
      ORDER BY created_at ASC
    `
      )
      .all(caseId);

    // Fetch Customer History (all other cases for this customer email)
    const customerHistory = db
      .prepare(
        `
      SELECT 
        id, category, urgency, status, ai_summary, created_at
      FROM cases
      WHERE customer_id = ?
      ORDER BY created_at DESC
    `
      )
      .all(caseItem.customer_id);

    return NextResponse.json({
      case: caseItem,
      audit_trail: auditTrail,
      customer_history: customerHistory,
    });
  } catch (err: any) {
    console.error('Error fetching single case:', err);
    return NextResponse.json(
      { error: `Failed to fetch case: ${err?.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    const body = await request.json();

    const existingCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId) as any;
    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { status, assigned_to, ai_draft_response, category } = body;

    const updates: string[] = [];
    const updateParams: any[] = [];
    const auditLogs: { event: string; detail: string }[] = [];

    if (status && status !== existingCase.status) {
      const validStatuses = ['new', 'in_progress', 'resolved', 'escalated'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      updates.push('status = ?');
      updateParams.push(status);

      if (status === 'escalated' && !existingCase.escalated_at) {
        updates.push("escalated_at = datetime('now')");
      }

      auditLogs.push({
        event: 'status_changed',
        detail: `Status manually updated from '${existingCase.status}' to '${status}'`,
      });
    }

    if (assigned_to && assigned_to !== existingCase.assigned_to) {
      updates.push('assigned_to = ?');
      updateParams.push(assigned_to);

      auditLogs.push({
        event: 'reassigned',
        detail: `Reassigned from '${existingCase.assigned_to}' to '${assigned_to}'`,
      });
    }

    if (
      ai_draft_response !== undefined &&
      ai_draft_response !== existingCase.ai_draft_response
    ) {
      updates.push('ai_draft_response = ?');
      updateParams.push(ai_draft_response);

      auditLogs.push({
        event: 'draft_updated',
        detail: 'Support agent modified the drafted response template',
      });
    }

    if (category && category !== existingCase.category) {
      updates.push('category = ?');
      updateParams.push(category);

      auditLogs.push({
        event: 'category_changed',
        detail: `Category changed from '${existingCase.category}' to '${category}'`,
      });
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No changes provided' });
    }

    updates.push("updated_at = datetime('now')");
    updateParams.push(caseId);

    // Apply updates in SQLite transaction
    const updateSql = `UPDATE cases SET ${updates.join(', ')} WHERE id = ?`;
    const insertAuditStmt = db.prepare(
      `INSERT INTO audit_log (id, case_id, event, detail, created_at) VALUES (?, ?, ?, ?, datetime('now'))`
    );

    const transaction = db.transaction(() => {
      db.prepare(updateSql).run(...updateParams);
      for (const log of auditLogs) {
        insertAuditStmt.run(generateId('aud'), caseId, log.event, log.detail);
      }
    });

    transaction();

    const updatedCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId);

    return NextResponse.json({
      success: true,
      case: updatedCase,
    });
  } catch (err: any) {
    console.error('Error updating case:', err);
    return NextResponse.json(
      { error: `Failed to update case: ${err?.message}` },
      { status: 500 }
    );
  }
}
