import { db } from './db';

export function getAssignee(category: string, urgency: string): string {
  switch (category) {
    case 'billing':
      return 'Billing Team';
    case 'technical':
      return 'Technical Support';
    case 'complaint':
      return 'Customer Success Lead';
    case 'general':
    default:
      return 'General Support';
  }
}

export interface EscalatedCaseInfo {
  id: string;
  customer_id: string;
  raw_request: string;
  category: string;
  urgency: string;
  assigned_to: string;
  created_at: string;
  escalated_at: string;
}

export function checkAndRunEscalations(thresholdSeconds = 60): EscalatedCaseInfo[] {
  const now = new Date();

  // Retrieve cases in 'new' or 'in_progress' status created prior to thresholdSeconds ago
  // Note: SQLite strftime('%s', 'now') returns seconds since epoch
  const query = `
    SELECT id, customer_id, raw_request, category, urgency, assigned_to, created_at
    FROM cases
    WHERE status IN ('new', 'in_progress')
      AND (cast(strftime('%s', 'now') as integer) - cast(strftime('%s', created_at) as integer)) >= ?
  `;

  const staleCases = db.prepare(query).all(thresholdSeconds) as any[];

  if (staleCases.length === 0) {
    return [];
  }

  const escalatedList: EscalatedCaseInfo[] = [];

  const updateCaseStmt = db.prepare(`
    UPDATE cases
    SET status = 'escalated',
        updated_at = datetime('now'),
        escalated_at = datetime('now')
    WHERE id = ?
  `);

  const insertAuditStmt = db.prepare(`
    INSERT INTO audit_log (id, case_id, event, detail, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);

  // Execute updates in a transaction for consistency
  const transaction = db.transaction((cases: any[]) => {
    for (const c of cases) {
      updateCaseStmt.run(c.id);

      const auditId = 'aud_' + Math.random().toString(36).substring(2, 10);
      const detail = `SLA Exceeded (${thresholdSeconds}s threshold) — automatically flipped status from 'new/in_progress' to 'escalated'`;
      insertAuditStmt.run(auditId, c.id, 'escalated', detail);

      escalatedList.push({
        id: c.id,
        customer_id: c.customer_id,
        raw_request: c.raw_request,
        category: c.category,
        urgency: c.urgency,
        assigned_to: c.assigned_to,
        created_at: c.created_at,
        escalated_at: new Date().toISOString(),
      });
    }
  });

  transaction(staleCases);

  return escalatedList;
}
