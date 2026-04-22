"use client";

import Navbar from "@/components/Navbar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '160px 0 100px',
        background: 'radial-gradient(circle at 50% 0%, hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.15) 0%, transparent 50%)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="glass" style={{ 
              padding: '0.6rem 1.25rem', 
              fontSize: '0.85rem', 
              color: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '2rem',
              display: 'inline-block',
              fontWeight: '600'
            }}>
              Now with Claude 3.5 Sonnet Integration
            </span>
            <h1 className="text-gradient" style={{ fontSize: '4.5rem', lineHeight: '1', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
              The Future of <br />
              <span className="text-gold">BandUP</span>
            </h1>
            <p style={{ color: 'var(--secondary)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              Empower your coaching institute with professional-grade AI evaluation. 
              BandUP is aligned to official band descriptors. Trusted by world-class trainers.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary" 
                style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
              >
                Join the Beta
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline" 
                style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
              >
                Book a Demo
              </motion.button>
            </div>
          </motion.div>
          
          <ScrollReveal delay={0.4} distance={60}>
            <div className="glass" style={{ 
              marginTop: '100px', 
              padding: '6px', 
              borderRadius: 'var(--radius-lg)',
              maxWidth: '1000px',
              margin: '100px auto 0',
              boxShadow: 'var(--shadow-lg)',
              background: 'linear-gradient(135deg, hsla(var(--foreground-h), var(--foreground-s), var(--foreground-l), 0.1), transparent)'
            }}>
              <div style={{ 
                backgroundColor: 'var(--surface-low)', 
                borderRadius: 'var(--radius-md)', 
                height: '540px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)',
                fontSize: '1.25rem',
                border: '1px solid var(--border)'
              }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Interactive Dashboard Preview
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 0' }}>
        <div className="container">
          <ScrollReveal>
            <h2 className="text-gradient" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '5rem', letterSpacing: '-0.03em' }}>
              Built for World-Class Institutes
            </h2>
          </ScrollReveal>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {[
              { 
                title: "Multi-Tenant Architecture", 
                desc: "Dedicated space for every institute. Manage trainers, groups, and students with isolated data security and premium branding." 
              },
              { 
                title: "7-Stage AI Pipeline", 
                desc: "Sophisticated evaluation following official band descriptors. CC, LR, GRA, and TA scored independently by high-precision models." 
              },
              { 
                title: "Human-in-the-Loop", 
                desc: "AI does the heavy lifting, but trainers remain in control. Override, edit, and approve evaluations with a unified review interface." 
              }
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="glass-card" 
                  style={{ height: '100%' }}
                >
                  <h3 className="text-gold" style={{ marginBottom: '1.25rem', fontSize: '1.5rem' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--secondary)', lineHeight: '1.6' }}>{feature.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', textAlign: 'center' }}>
            {[
              { label: 'Evaluation Speed', value: '45s' },
              { label: 'Accuracy Rating', value: '98%' },
              { label: 'Active Institutes', value: '50+' }
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: '800' }}>{stat.value}</div>
                <div style={{ color: 'var(--secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
