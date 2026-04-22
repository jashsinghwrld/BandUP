import Link from "next/link";
import { db } from "@/lib/db";
import { evaluations, submissions, prompts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrainerEvaluationPage({ params }: { params: { id: string } }) {
  const [evaluation] = await db.select().from(evaluations).where(eq(evaluations.submissionId, params.id));
  if (!evaluation) return notFound();

  const [submission] = await db.select().from(submissions).where(eq(submissions.id, params.id));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient">Trainer Review</h1>
          <p style={{ color: 'var(--secondary)' }}>Review and optionally override AI-generated band scores and feedback.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ color: 'var(--error)' }}>Reject</button>
          <button className="btn btn-primary">Approve Evaluation</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <section className="glass-card">
            <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Student Submission</h3>
            <div style={{ color: 'var(--foreground)', lineHeight: '1.7', whiteSpace: 'pre-wrap', padding: '1rem', backgroundColor: 'var(--surface-low)', borderRadius: 'var(--radius-md)' }}>
              {submission.body}
            </div>
          </section>

          <section className="glass-card">
            <h3 className="text-gold" style={{ marginBottom: '1rem' }}>AI Feedback & Corrections</h3>
            {/* Simplified view of feedback for trainer review */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(evaluation.feedbackJson as any).paragraph_feedback?.map((para: any, idx: number) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Paragraph {idx + 1}</p>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{para.issues?.length} issues detected</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Band Score Override</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { name: 'Task Achievement', key: 'bandTa', value: evaluation.bandTa },
                { name: 'Coherence & Cohesion', key: 'bandCc', value: evaluation.bandCc },
                { name: 'Lexical Resource', key: 'bandLr', value: evaluation.bandLr },
                { name: 'Grammatical Range', key: 'bandGra', value: evaluation.bandGra },
              ].map((score) => (
                <div key={score.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem' }}>{score.name}</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    defaultValue={score.value?.toString()} 
                    style={{ 
                      width: '60px', 
                      backgroundColor: 'var(--surface-high)', 
                      border: '1px solid var(--border)', 
                      color: 'white', 
                      padding: '0.25rem', 
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center'
                    }} 
                  />
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Overall Band</span>
                <span className="text-gold">{evaluation.bandOverall}</span>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Manual Feedback</h3>
            <textarea 
              rows={5} 
              style={{ width: '100%', backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem', color: 'white', resize: 'none' }}
              placeholder="Add your own comments for the student..."
            ></textarea>
          </div>
        </aside>
      </div>
    </div>
  );
}
