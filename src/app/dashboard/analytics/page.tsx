import { auth } from "@/auth";
import { db } from "@/lib/db";
import { submissions, evaluations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) return redirect("/api/auth/signin");

  // In a real app, we'd filter by studentId (linked to session.user.id)
  // For this MVP, we'll fetch all evaluations belonging to this tenant/org
  const userEvaluations = await db
    .select({
      id: evaluations.id,
      bandOverall: evaluations.bandOverall,
      createdAt: evaluations.createdAt,
    })
    .from(evaluations)
    .innerJoin(submissions, eq(evaluations.submissionId, submissions.id))
    // we would filter by user email/id here
    .orderBy(desc(evaluations.createdAt))
    .limit(10);

  const totalSubmissions = userEvaluations.length;
  const avgBand = totalSubmissions > 0 
    ? (userEvaluations.reduce((acc, curr) => acc + parseFloat(curr.bandOverall || "0"), 0) / totalSubmissions).toFixed(1)
    : "0.0";

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Performance Analytics</h1>
        <p style={{ color: 'var(--secondary)' }}>Track your progress and band score trajectory.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <ScrollReveal direction="up" delay={0.1}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>Total Evaluated</span>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>{totalSubmissions}</div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>Average Band</span>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--success)' }}>{avgBand}</div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>Target Band</span>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--foreground)' }}>7.5</div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.4}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 className="text-gold" style={{ marginBottom: '2rem' }}>Band Score Progression</h3>
          
          {userEvaluations.length > 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
              {userEvaluations.reverse().map((evalItem, index) => {
                const height = (parseFloat(evalItem.bandOverall || "0") / 9) * 100;
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{evalItem.bandOverall}</div>
                    <div style={{ 
                      width: '100%', 
                      height: `${height}%`, 
                      background: 'linear-gradient(to top, var(--primary), var(--success))',
                      borderRadius: 'var(--radius-sm)',
                      opacity: 0.8
                    }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>
                      {new Date(evalItem.createdAt || "").toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--secondary)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
              No evaluations found yet. Start by submitting your first assignment!
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
