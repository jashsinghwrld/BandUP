"use server";

import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { evaluateSubmission } from "@/lib/evaluation/engine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitWriting(formData: {
  assignmentId: string;
  studentId: string;
  body: string;
  wordCount: number;
  timeTakenSeconds: number;
}) {
  try {
    // Current Org ID - In real app, get from session
    const orgId = "00000000-0000-0000-0000-000000000000";

    // 1. Save submission to DB
    const [submission] = await db.insert(submissions).values({
      orgId,
      assignmentId: formData.assignmentId,
      studentId: formData.studentId,
      body: formData.body,
      wordCount: formData.wordCount,
      timeTakenSeconds: formData.timeTakenSeconds,
      isFinal: true,
      submittedAt: new Date(),
    }).returning();

    // 2. Trigger async evaluation
    // Note: In production, this should be a background queue job.
    // For MVP, we run it and wait, or trigger it and redirect.
    await evaluateSubmission(submission.id);

    revalidatePath(`/dashboard/student/assignments/${formData.assignmentId}`);
    return { success: true, submissionId: submission.id };
  } catch (error) {
    console.error("Submission failed:", error);
    return { success: false, error: "Failed to submit response" };
  }
}
