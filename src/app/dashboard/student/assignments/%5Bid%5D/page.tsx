import { useState, useEffect } from "react";
import Link from "next/link";
import { submitWriting } from "@/app/actions/submissions";
import { useRouter } from "next/navigation";

export default function WritingInterface({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock prompt data
  const prompt = {
    title: "Task 2: Environmental Protection",
    body: `Some people believe that it is the responsibility of individual citizens to protect the environment. Others argue that only governments can make a real difference. \n\nDiscuss both views and give your own opinion.`,
    wordLimitMin: 250,
  };

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < 50) return alert("Submission too short. Please write more.");
    
    setIsSubmitting(true);
    try {
      const result = await submitWriting({
        assignmentId: params.id,
        studentId: "00000000-0000-0000-0000-000000000000", // Placeholder
        body: text,
        wordCount,
        timeTakenSeconds: 3600 - timeLeft,
      });

      if (result.success) {
        alert("Success! Your work is being evaluated.");
        router.push(`/dashboard/student/evaluations/${result.submissionId}`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard/student/assignments" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            ← Back to Assignments
          </Link>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>{prompt.title}</h1>
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem', backgroundColor: 'var(--surface-low)' }}>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--foreground)' }}>
            {prompt.body}
          </p>
        </div>

        <div className="glass" style={{ padding: '2px', borderRadius: 'var(--radius-md)' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your response here..."
            style={{
              width: '100%',
              height: '500px',
              padding: '1.5rem',
              backgroundColor: 'var(--surface-mid)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <aside>
        <div style={{ position: 'sticky', top: '100px', display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Word Count</span>
            <div style={{ fontSize: '2.5rem', fontWeight: '600', color: wordCount < prompt.wordLimitMin ? 'var(--error)' : 'var(--success)' }}>
              {wordCount}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Target: {prompt.wordLimitMin}+ words</span>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Time Remaining</span>
            <div style={{ fontSize: '2rem', fontWeight: '600', fontFamily: 'monospace' }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Evaluating..." : "Finalise Submission"}
            </button>
            <button className="btn btn-outline" style={{ width: '100%' }} disabled={isSubmitting}>
              Save Draft
            </button>
          </div>

          <div className="glass" style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--secondary)', lineHeight: '1.4' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Guidelines:</h4>
            <ul style={{ paddingLeft: '1rem' }}>
              <li>Address all parts of the task.</li>
              <li>Organise in clear paragraphs.</li>
              <li>Use a wide range of vocabulary.</li>
              <li>Ensure grammatical accuracy.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
