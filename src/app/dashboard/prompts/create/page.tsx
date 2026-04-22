import Link from "next/link";

export default function CreatePromptPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/prompts" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          ← Back to Prompts
        </Link>
        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Create Prompt</h1>
        <p style={{ color: 'var(--secondary)' }}>Author a new IELTS GT writing task manually.</p>
      </div>

      <form className="glass-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Task Type</label>
            <select className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'white', backgroundColor: 'var(--surface-mid)' }}>
              <option value="task2_opinion">Task 2: Opinion</option>
              <option value="task2_discussion">Task 2: Discussion</option>
              <option value="task2_problem_solution">Task 2: Problem/Solution</option>
              <option value="task1_formal">Task 1: Formal Letter</option>
              <option value="task1_informal">Task 1: Informal Letter</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Difficulty (Target Band)</label>
            <input type="number" step="0.5" min="4" max="9" defaultValue="7.0" className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'white', backgroundColor: 'var(--surface-mid)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Prompt Body</label>
          <textarea rows={8} className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'white', backgroundColor: 'var(--surface-mid)', resize: 'vertical' }} placeholder="Enter the full IELTS task description here..."></textarea>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Topic Tags (comma separated)</label>
          <input type="text" className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'white', backgroundColor: 'var(--surface-mid)' }} placeholder="e.g. environment, technology, work" />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Save Prompt
          </button>
          <button type="button" className="btn btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
