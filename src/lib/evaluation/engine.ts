import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { evaluations, submissions, errorPatterns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type EvaluationResult = {
  bandOverall: number;
  bandTa: number;
  bandCc: number;
  bandLr: number;
  bandGra: number;
  feedback: any;
  modelAnswer: string;
};

const CRITERION_SYSTEM_PROMPTS: Record<string, string> = {
  ta: `You are a strict IELTS examiner scoring ONLY Task Achievement (TA). 
       Ignore grammar, vocabulary, and cohesion. Focus exclusively on: 
       Did the student address all bullet points/requirements? 
       Is the tone appropriate? Is the purpose clear?
       Score on the official IELTS 0–9 band scale (0.5 increments).
       Return JSON only: {"band": <float>, "evidence": "<justification>", "errors": []}`,
  
  cc: `You are a strict IELTS examiner scoring ONLY Coherence & Cohesion (CC). 
       Ignore task response, vocabulary, and grammar. Focus exclusively on: 
       Logical sequencing of information? Use of cohesive devices? 
       Paragraph structure and central topics?
       Score on the official IELTS 0–9 band scale (0.5 increments).
       Return JSON only: {"band": <float>, "evidence": "<justification>", "errors": []}`,

  lr: `You are a strict IELTS examiner scoring ONLY Lexical Resource (LR). 
       Ignore grammar, task response, and cohesion. Focus exclusively on: 
       Range of vocabulary? Precision of word choice? 
       Awareness of style/collocation? Spelling and word formation?
       Score on the official IELTS 0–9 band scale (0.5 increments).
       Return JSON only: {"band": <float>, "evidence": "<justification>", "errors": []}`,

  gra: `You are a strict IELTS examiner scoring ONLY Grammatical Range & Accuracy (GRA). 
        Ignore task response, vocabulary, and cohesion. Focus exclusively on: 
        Range of structures? Accuracy of complex sentences? 
        Punctuation and error frequency?
        Score on the official IELTS 0–9 band scale (0.5 increments).
        Return JSON only: {"band": <float>, "evidence": "<justification>", "errors": []}`
};

export async function evaluateSubmission(submissionId: string) {
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, submissionId));
  if (!submission) throw new Error("Submission not found");

  // Stage 1: Pre-check (Simplified for MVP)
  if ((submission.wordCount ?? 0) < 50) {
      return { success: false, reason: "Submission too short" };
  }

  // Stage 2: Criteria Scoring (Parallel LLM calls)
  try {
    const criteria = ['ta', 'cc', 'lr', 'gra'];
    const scores: Record<string, any> = {};

    await Promise.all(criteria.map(async (key) => {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 600,
        temperature: 0.1,
        system: CRITERION_SYSTEM_PROMPTS[key],
        messages: [{ 
            role: "user", 
            content: `Submission Text:\n${submission.body}` 
        }],
      });

      const content = response.content
        .filter(block => 'text' in block)
        .map(block => (block as any).text)
        .join('');
        
      scores[key] = JSON.parse(content);
    }));

    // Overall Calculation
    const avg = (scores.ta.band + scores.cc.band + scores.lr.band + scores.gra.band) / 4;
    const bandOverall = Math.round(avg * 2) / 2;

    // Stage 4: Feedback & Model Answer (Single call to reduce latency for MVP)
    const feedbackResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      temperature: 0.7,
      system: `You are an expert IELTS writing coach. Given the student's submission and their scores, 
               provide detailed paragraph-level feedback and a Band 7.5+ model rewrite.
               Output JSON only: {"paragraph_feedback": [], "overall_advice": "", "model_answer": ""}`,
      messages: [{ 
          role: "user", 
          content: `Submission:\n${submission.body}\n\nScores: TA=${scores.ta.band}, CC=${scores.cc.band}, LR=${scores.lr.band}, GRA=${scores.gra.band}` 
      }],
    });

    const feedbackContent = feedbackResponse.content
        .filter(block => 'text' in block)
        .map(block => (block as any).text)
        .join('');
    
    const feedbackData = JSON.parse(feedbackContent);

    // Persist Evaluation
    await db.insert(evaluations).values({
      submissionId,
      orgId: submission.orgId,
      bandTa: scores.ta.band.toString(),
      bandCc: scores.cc.band.toString(),
      bandLr: scores.lr.band.toString(),
      bandGra: scores.gra.band.toString(),
      bandOverall: bandOverall.toString(),
      feedbackJson: feedbackData,
      modelAnswer: feedbackData.model_answer,
      llmModel: "claude-3-5-sonnet-20240620",
      status: "completed",
      source: "ai"
    });

    return { success: true, bandOverall };

  } catch (error) {
    console.error("Evaluation pipeline failed:", error);
    return { success: false, error: "Evaluation failed" };
  }
}
