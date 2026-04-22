import { auth } from "@/auth";
import { db } from "@/lib/db";
import { prompts, submissions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClipboardList, ChevronRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user) return redirect("/api/auth/signin");

  // Fetch all active prompts (available as assignments in this MVP)
  const availablePrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.status, "active"))
    .orderBy(desc(prompts.createdAt));

  // Fetch user's recent submissions to show status
  const userSubmissions = await db
    .select()
    .from(submissions)
    // .where(eq(submissions.studentId, session.user.id))
    .orderBy(desc(submissions.submittedAt));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Assignments</h1>
          <p style={{ color: 'var(--secondary)' }}>Practice your writing with official IELTS GT tasks.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {availablePrompts.length > 0 ? (
          availablePrompts.map((prompt, i) => {
            const hasSubmitted = userSubmissions.some(s => s.assignmentId === prompt.id);
            return (
              <ScrollReveal key={prompt.id} delay={i * 0.05}>
                <Link href={`/dashboard/student/assignments/${prompt.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--primary-low)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--primary)'
                      }}>
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="glass" style={{ padding: '0.1rem 0.6rem', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>
                            {prompt.taskType?.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> 40 mins
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{prompt.taskType?.includes('task2') ? 'Writing Task 2' : 'Writing Task 1'}</h3>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {prompt.body?.substring(0, 80)}...
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      {hasSubmitted ? (
                        <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600' }}>Completed</span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Start Task</span>
                      )}
                      <ChevronRight size={20} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>
            No assignments available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
