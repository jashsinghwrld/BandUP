import Link from "next/link";
import { db } from "@/lib/db";
import { evaluations, submissions, prompts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EvaluationDetailPage({ params }: { params: { id: string } }) {
  // Fetch detailed evaluation data
  const [evaluation] = await db.select().from(evaluations).where(eq(evaluations.submissionId, params.id));
  if (!evaluation) return notFound();

  const [submission] = await db.select().from(submissions).where(eq(submissions.id, params.id));
  const [prompt] = await db.select().from(prompts).where(eq(prompts.id, submission.assignmentId)); // Simplified logic for mock

  const feedback = evaluation.feedbackJson as any;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <Link href="/dashboard/student/assignments" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
            ← Back to Performance
          </Link>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Evaluation Report</h1>
        </div>
        <div className="glass" style={{ padding: '1rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '2px solid var(--primary)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', display: 'block' }}>Overall Band</span>
          <span className="text-gold" style={{ fontSize: '3rem', fontWeight: '800' }}>{evaluation.bandOverall}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Task Achievement', score: evaluation.bandTa, color: '#10b981' },
          { label: 'Coherence & Cohesion', score: evaluation.bandCc, color: '#3b82f6' },
          { label: 'Lexical Resource', score: evaluation.bandLr, color: '#f59e0b' },
          { label: 'Grammatical Range', score: evaluation.bandGra, color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ textAlign: 'center', borderTop: `4px solid ${item.color}` }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'block', marginBottom: '0.5rem' }}>{item.label}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{item.score}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <section>
          <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>Paragraph Feedback</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {feedback.paragraph_feedback?.map((para: any, idx: number) => (
              <div key={idx} className="glass-card">
                <p style={{ fontStyle: 'italic', color: 'var(--secondary)', marginBottom: '1rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                  "{para.para_text?.substring(0, 100)}..."
                </p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {para.issues?.map((issue: any, i: number) => (
                    <div key={i} style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <span style={{ color: 'var(--error)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{issue.type}</span>
                      <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>{issue.sentence}</p>
                      <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{issue.explanation}</p>
                    </div>
                  ))}
                  <p style={{ color: 'var(--success)', fontSize: '0.9rem' }}>✓ {para.positive}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>Model Answer (Band 7.5+)</h2>
          <div className="glass-card" style={{ backgroundColor: 'var(--surface-low)', color: 'var(--secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {evaluation.modelAnswer}
          </div>
          
          <div className="glass-card" style={{ marginTop: '2rem', background: 'var(--primary-low)', borderColor: 'var(--primary)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>How to reach your target?</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{feedback.overall_advice}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
