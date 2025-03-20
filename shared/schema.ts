import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

// Keep type definitions
export const cueSportsDisciplines = [
  'Snooker',
  'American Pool',
  'Billiards',
  'Black Ball',
  'Chinese Pool',
  'Carom',
  'Russian Pyramid'
] as const;

export type CueSportsDiscipline = typeof cueSportsDisciplines[number];

export const disciplineTypes = {
  Snooker: ['Full Reds', 'Six Reds'],
  'American Pool': ['8 Ball', '9 Ball', '10 Ball', 'Straight Pool'],
  'Chinese Pool': ['Standard', 'Pro Format'],
  'Carom': ['3-Cushion', '1-Cushion', 'Artistic Billiards'],
  'Billiards': ['English Billiards'],
  'Black Ball': ['Standard'],
  'Russian Pyramid': ['Free Pyramid', 'Dynamic Pyramid']
} as const;

export type DisciplineType = typeof disciplineTypes[keyof typeof disciplineTypes][number];

export const matchTypes = [
  'Single',
  'Doubles',
  'Scottish Doubles',
  'Mixed Doubles',
  'Teams'
] as const;

export type MatchType = typeof matchTypes[number];

export const tournamentFormats = [
  'Round Robin',
  'Single Elimination',
  'Double Elimination',
  'Multi-Stage',
  'Swiss System',
  'Custom Format'
] as const;

export type TournamentFormat = typeof tournamentFormats[number];

// Database schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("player"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  rating: integer("rating").default(1500),
  createdAt: timestamp("created_at").defaultNow()
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  discipline: text("discipline", { enum: cueSportsDisciplines }).notNull(),
  disciplineType: text("discipline_type").notNull(),
  matchType: text("matchType", { enum: matchTypes }).notNull().default('Single'),
  organizerId: integer("organizer_id").notNull(),
  venueId: integer("venue_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"),
  format: text("format", { enum: tournamentFormats }).notNull(),
  participants: integer("participants").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  currentParticipants: integer("current_participants").default(0),
  prize: integer("prize").notNull(),
  participationFee: integer("participation_fee").notNull().default(0),
  description: text("description").notNull(),
  currentRound: integer("current_round").default(1),
  totalRounds: integer("total_rounds"),
  roundStartTimes: jsonb("round_start_times").default([]),
  bracket: jsonb("bracket").notNull().default([]),
  rules: jsonb("rules").default([]),
  sponsorships: jsonb("sponsorships").default([]),
  organizerDetails: jsonb("organizer_details").notNull().default({
    contactEmail: "",
    contactPhone: "",
    website: ""
  }),
  prizeBreakdown: jsonb("prize_breakdown").default([])
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  score1: integer("score1").default(0),
  score2: integer("score2").default(0),
  status: text("status").notNull().default('scheduled'),
  round: integer("round").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  winner: integer("winner"),
  matchNumber: integer("match_number").notNull(),
  nextMatchNumber: integer("next_match_number"),
  isWinnersBracket: boolean("is_winners_bracket").default(true),
  frameCount: integer("frame_count").default(5),
  refereeId: integer("referee_id"),
  canDraw: boolean("can_draw").default(false),
  tableNumber: integer("table_number"),
  lastEditedBy: integer("last_edited_by"),
  lastEditedAt: timestamp("last_edited_at"),
  notes: text("notes"),
  isLocked: boolean("is_locked").default(false)
});

// Schema definitions for form validation
export const insertTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  discipline: z.enum(cueSportsDisciplines),
  disciplineType: z.string().min(1, "Discipline type is required"),
  matchType: z.enum(matchTypes),
  format: z.enum(tournamentFormats),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  participants: z.string().min(1, "Number of participants is required"),
  prize: z.string().min(1, "Prize amount is required"),
  participationFee: z.string().min(1, "Participation fee is required"),
  description: z.string().min(1, "Description is required"),
  venueId: z.string().optional(),
  organizerDetails: z.object({
    contactPhone: z.string().min(1, "Contact phone is required"),
    website: z.string().optional()
  })
});

export const insertUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().optional().default("player")
}).refine((data) => data.password.length >= 8, {message: "Password must be at least 8 characters", path:["password"]});


export const insertMatchSchema = z.object({
  tournamentId: z.number().int().min(1, "Tournament ID is required"),
  player1Id: z.number().int().min(1, "Player 1 ID is required"),
  player2Id: z.number().int().min(1, "Player 2 ID is required"),
  score1: z.number().int().default(0),
  score2: z.number().int().default(0),
  status: z.enum(['scheduled', 'in_progress', 'completed']).default('scheduled'),
  round: z.number().int().min(1, "Round number is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  winner: z.number().int().optional(),
  matchNumber: z.number().int().min(1, "Match number is required"),
  nextMatchNumber: z.number().int().optional(),
  isWinnersBracket: z.boolean().default(true),
  frameCount: z.number().int().default(5),
  refereeId: z.number().int().optional(),
  canDraw: z.boolean().default(false),
  tableNumber: z.number().int().optional(),
  lastEditedBy: z.number().int().optional(),
  lastEditedAt: z.string().optional(),
  notes: z.string().optional(),
  isLocked: z.boolean().default(false)
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;