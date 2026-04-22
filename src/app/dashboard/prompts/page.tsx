import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export default function PromptsPage() {
  // Mock data for initial UI
  const prompts = [
    { id: '1', taskType: 'task2_opinion', difficulty: 7.0, body: 'Some people think that the best way to reduce crime is to give longer prison sentences...', status: 'active', tags: ['crime', 'law'] },
    { id: '2', taskType: 'task1_informal', difficulty: 6.5, body: 'Write a letter to your friend inviting them to your house for a weekend...', status: 'active', tags: ['social', 'friends'] },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <ScrollReveal direction="right">
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Prompts</h1>
            <p style={{ color: 'var(--secondary)' }}>Manage and generate IELTS GT writing tasks.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="left">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline">
              Generate with AI
            </motion.button>
            <Link href="/dashboard/prompts/create" className="btn btn-primary">
              <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Manually</motion.span>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {prompts.map((prompt, i) => (
          <ScrollReveal key={prompt.id} delay={i * 0.1}>
            <motion.div 
              whileHover={{ x: 4, borderColor: 'var(--primary)' }}
              className="glass-card" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="glass" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
                    {prompt.taskType.toUpperCase()}
                  </span>
                  <span className="glass" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                    Band {prompt.difficulty}
                  </span>
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: '500' }}>
                  {prompt.body}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {prompt.tags.map(tag => (
                    <span key={tag} style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>#{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Edit</button>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--error)' }}>Archive</button>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
