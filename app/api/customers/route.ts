import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const customers = db.prepare(`
      SELECT 
        cust.id,
        cust.name,
        cust.email,
        cust.created_at,
        COUNT(c.id) as total_cases,
        SUM(CASE WHEN c.status IN ('new', 'in_progress') THEN 1 ELSE 0 END) as open_cases,
        SUM(CASE WHEN c.status = 'escalated' THEN 1 ELSE 0 END) as escalated_cases,
        SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolved_cases
      FROM customers cust
      LEFT JOIN cases c ON cust.id = c.customer_id
      GROUP BY cust.id
      ORDER BY cust.created_at DESC
    `).all();

    // Fetch cases per customer
    const customersWithHistory = customers.map((c: any) => {
      const caseHistory = db.prepare(`
        SELECT id, category, urgency, status, ai_summary, created_at
        FROM cases
        WHERE customer_id = ?
        ORDER BY created_at DESC
      `).all(c.id);

      return {
        ...c,
        cases: caseHistory,
      };
    });

    return NextResponse.json({
      customers: customersWithHistory,
    });
  } catch (err: any) {
    console.error('Error fetching customers directory:', err);
    return NextResponse.json(
      { error: `Database error: ${err?.message}` },
      { status: 500 }
    );
  }
}
