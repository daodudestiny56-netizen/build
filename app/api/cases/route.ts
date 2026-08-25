import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();

    let query = `
      SELECT 
        c.id,
        c.customer_id,
        c.raw_request,
        c.category,
        c.urgency,
        c.ai_summary,
        c.ai_draft_response,
        c.assigned_to,
        c.status,
        c.is_urgent_flag,
        c.created_at,
        c.updated_at,
        c.escalated_at,
        cust.name as customer_name,
        cust.email as customer_email
      FROM cases c
      JOIN customers cust ON c.customer_id = cust.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status && status !== 'all') {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    if (urgency && urgency !== 'all') {
      query += ` AND c.urgency = ?`;
      params.push(urgency);
    }

    if (category && category !== 'all') {
      query += ` AND c.category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (cust.name LIKE ? OR cust.email LIKE ? OR c.raw_request LIKE ? OR c.ai_summary LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY c.created_at DESC`;

    const cases = db.prepare(query).all(...params);

    // Calculate Pipeline Stats Bar counts
    const totalCount = (db.prepare('SELECT COUNT(*) as cnt FROM cases').get() as any).cnt;
    const openCount = (db.prepare("SELECT COUNT(*) as cnt FROM cases WHERE status IN ('new', 'in_progress')").get() as any).cnt;
    const escalatedCount = (db.prepare("SELECT COUNT(*) as cnt FROM cases WHERE status = 'escalated'").get() as any).cnt;
    const resolvedTodayCount = (db.prepare("SELECT COUNT(*) as cnt FROM cases WHERE status = 'resolved' AND date(updated_at) = date('now')").get() as any).cnt;
    const urgentCount = (db.prepare("SELECT COUNT(*) as cnt FROM cases WHERE is_urgent_flag = 1 AND status != 'resolved'").get() as any).cnt;

    return NextResponse.json({
      cases,
      stats: {
        total: totalCount,
        open: openCount,
        escalated: escalatedCount,
        resolved_today: resolvedTodayCount,
        urgent: urgentCount,
      },
    });
  } catch (err: any) {
    console.error('Error fetching cases:', err);
    return NextResponse.json(
      { error: `Database query error: ${err?.message || 'Failed to fetch cases'}` },
      { status: 500 }
    );
  }
}
