import { pgTable, uuid, varchar, integer, timestamp, text, boolean, decimal, pgEnum, jsonb, bigint, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['admin', 'trainer', 'student']);
export const planEnum = pgEnum('plan', ['free', 'pro', 'enterprise']);
export const taskTypeEnum = pgEnum('task_type', [
  'task1_formal',
  'task1_semiformal',
  'task1_informal',
  'task2_opinion',
  'task2_discussion',
  'task2_problem_solution',
  'task2_adv_disadv'
]);
export const statusEnum = pgEnum('status', ['draft', 'active', 'archived', 'pending', 'closed', 'processing', 'completed', 'failed', 'approved']);
export const assigneeTypeEnum = pgEnum('assignee_type', ['student', 'group']);
export const evaluationSourceEnum = pgEnum('evaluation_source', ['ai', 'trainer', 'hybrid']);
export const patternTypeEnum = pgEnum('pattern_type', [
  'grammar',
  'vocabulary',
  'coherence',
  'task_response',
  'paragraphing',
  'run_on',
  'intro_weakness',
  'conclusion_weakness'
]);

// 3.1 organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  plan: planEnum('plan').default('free').notNull(),
  maxStudents: integer('max_students').default(20),
  aiTokensUsed: bigint('ai_tokens_used', { mode: 'number' }).default(0),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.2 users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  targetBand: decimal('target_band', { precision: 2, scale: 1 }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.3 prompts
export const prompts = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id), // NULL = global/system
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  taskType: taskTypeEnum('task_type').notNull(),
  difficulty: decimal('difficulty', { precision: 2, scale: 1 }).notNull(),
  topicTags: text('topic_tags').array(), 
  body: text('body').notNull(),
  wordLimitMin: integer('word_limit_min').notNull(),
  isAiGenerated: boolean('is_ai_generated').default(false),
  status: statusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.4 assignments
export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  promptId: uuid('prompt_id').references(() => prompts.id).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id).notNull(),
  assigneeType: assigneeTypeEnum('assignee_type').notNull(),
  assigneeId: uuid('assignee_id').notNull(), // user_id or group_id
  dueAt: timestamp('due_at'),
  allowResubmit: boolean('allow_resubmit').default(true),
  maxAttempts: integer('max_attempts').default(3),
  status: statusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.5 submissions
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  assignmentId: uuid('assignment_id').references(() => assignments.id).notNull(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  attemptNumber: integer('attempt_number').default(1).notNull(),
  body: text('body').notNull(),
  wordCount: integer('word_count'),
  timeTakenSeconds: integer('time_taken_seconds'),
  isFinal: boolean('is_final').default(false),
  isLate: boolean('is_late').default(false),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.6 evaluations
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  submissionId: uuid('submission_id').references(() => submissions.id).notNull(),
  version: integer('version').default(1).notNull(),
  source: evaluationSourceEnum('source').default('ai').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  bandTa: decimal('band_ta', { precision: 2, scale: 1 }),
  bandCc: decimal('band_cc', { precision: 2, scale: 1 }),
  bandLr: decimal('band_lr', { precision: 2, scale: 1 }),
  bandGra: decimal('band_gra', { precision: 2, scale: 1 }),
  bandOverall: decimal('band_overall', { precision: 2, scale: 1 }),
  feedbackJson: jsonb('feedback_json').default({}),
  modelAnswer: text('model_answer'),
  llmModel: varchar('llm_model', { length: 255 }),
  llmTokensUsed: integer('llm_tokens_used'),
  processingMs: integer('processing_ms'),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 3.7 evaluation_overrides
export const evaluationOverrides = pgTable('evaluation_overrides', {
  id: uuid('id').primaryKey().defaultRandom(),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  trainerId: uuid('trainer_id').references(() => users.id).notNull(),
  fieldChanged: varchar('field_changed', { length: 255 }).notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3.8 error_patterns
export const errorPatterns = pgTable('error_patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  patternType: patternTypeEnum('pattern_type').notNull(),
  occurrenceCount: integer('occurrence_count').default(1).notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
  lastSubmissionId: uuid('last_submission_id').references(() => submissions.id).notNull(),
  examples: jsonb('examples').default([]), 
});

// 3.9 analytics_snapshots
export const analyticsSnapshots = pgTable('analytics_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  studentId: uuid('student_id').references(() => users.id), 
  snapshotDate: date('snapshot_date').notNull(),
  avgBandTa: decimal('avg_band_ta', { precision: 3, scale: 2 }),
  avgBandCc: decimal('avg_band_cc', { precision: 3, scale: 2 }),
  avgBandLr: decimal('avg_band_lr', { precision: 3, scale: 2 }),
  avgBandGra: decimal('avg_band_gra', { precision: 3, scale: 2 }),
  avgBandOverall: decimal('avg_band_overall', { precision: 3, scale: 2 }),
  submissionCount: integer('submission_count').default(0),
  predictedTargetDate: date('predicted_target_date'),
});
