import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <h2 className="text-gold" style={{ padding: '0 1rem', marginBottom: '2rem' }}>BandUP</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/dashboard" className="nav-link active">Dashboard</Link>
          <Link href="/dashboard/prompts" className="nav-link">Prompts</Link>
          <Link href="/dashboard/assignments" className="nav-link">Assignments</Link>
          <Link href="/dashboard/submissions" className="nav-link">Submissions</Link>
          <Link href="/dashboard/analytics" className="nav-link">Analytics</Link>
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <Link href="/dashboard/settings" className="nav-link">Settings</Link>
            <Link href="/api/auth/signout" className="nav-link">Logout</Link>
          </div>
        </nav>
      </aside>
      
      <main style={{ flex: 1, backgroundColor: 'var(--background)' }}>
        <header className="navbar" style={{ position: 'sticky', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Trainer Mode</span>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--surface-high)',
                border: '1px solid var(--primary)'
              }}></div>
            </div>
          </div>
        </header>
        
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
