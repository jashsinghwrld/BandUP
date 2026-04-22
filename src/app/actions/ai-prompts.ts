"use server";

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { prompts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAIPrompt(formData: FormData) {
  const taskType = formData.get("taskType") as string;
  const difficulty = formData.get("difficulty") as string;
  const topicTags = (formData.get("topicTags") as string)?.split(",") || [];
  
  // These would come from the session in a real app
  const orgId = "00000000-0000-0000-0000-000000000000"; // Placeholder
  const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder

  try {
    const systemPrompt = `You are an official IELTS examiner. Generate a ${taskType} writing prompt 
      targeting Band ${difficulty} candidates. Output JSON only: 
      {"body": "<full task text>", "scenario": "<context>", 
       "bullet_points": ["point1","point2","point3"]} 
      The prompt must be realistic, unambiguous, and match IELTS GT conventions.`;

    const userPrompt = `Generate an IELTS GT ${taskType} prompt on topics: ${topicTags.join(", ")}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.7,
    });

    // Extract text from Anthropic response (handling potential array of blocks)
    const contentText = response.content
        .filter(block => 'text' in block)
        .map(block => (block as any).text)
        .join('');
    
    const parsed = JSON.parse(contentText);

    // Insert into database
    await db.insert(prompts).values({
      orgId: null, // Global for now or use orgId
      createdBy: userId,
      taskType: taskType as any,
      difficulty: difficulty,
      topicTags: topicTags,
      body: parsed.body,
      wordLimitMin: taskType.includes("task1") ? 150 : 250,
      isAiGenerated: true,
      status: "active",
    });

    revalidatePath("/dashboard/prompts");
    return { success: true };
  } catch (error) {
    console.error("AI Generation failed:", error);
    return { success: false, error: "Failed to generate prompt" };
  }
}
