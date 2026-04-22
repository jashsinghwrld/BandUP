import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '120px 0 80px',
        background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade-in">
            <span className="glass" style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.8rem', 
              color: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
              display: 'inline-block'
            }}>
              Now with Claude 3.5 Sonnet Integration
            </span>
            <h1 className="text-gradient" style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              The Future of <br />
              <span className="text-gold">BandUP</span>
            </h1>
            <p style={{ color: 'var(--secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Empower your coaching institute with professional-grade AI evaluation. 
              BandUP is aligned to official band descriptors. Trusted by trainers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Join the Beta
              </button>
              <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Book a Demo
              </button>
            </div>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="glass" style={{ 
            marginTop: '80px', 
            padding: '4px', 
            borderRadius: 'var(--radius-lg)',
            maxWidth: '1000px',
            margin: '80px auto 0',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ 
              backgroundColor: 'var(--surface-low)', 
              borderRadius: 'var(--radius-md)', 
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--border-strong)',
              fontSize: '1.5rem'
            }}>
              {/* This is where a high-quality dashboard mockup would go */}
              Interactive Dashboard Preview
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 className="text-gradient" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>
            Built for World-Class Institutes
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <div className="glass-card">
              <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Multi-Tenant Architecture</h3>
              <p style={{ color: 'var(--secondary)' }}>
                Dedicated space for every institute. Manage trainers, groups, and students with isolated data security.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="text-gold" style={{ marginBottom: '1rem' }}>7-Stage AI Pipeline</h3>
              <p style={{ color: 'var(--secondary)' }}>
                Sophisticated evaluation following official band descriptors. CC, LR, GRA, and TA scored independently.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="text-gold" style={{ marginBottom: '1rem' }}>Trainer Human-in-the-Loop</h3>
              <p style={{ color: 'var(--secondary)' }}>
                AI does the heavy lifting, but trainers remain in control. Override, edit, and approve evaluations with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
