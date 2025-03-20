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
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
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

// Simplified form validation schema
export const insertTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  discipline: z.enum(cueSportsDisciplines, {
    errorMap: () => ({ message: "Please select a discipline" })
  }),
  disciplineType: z.string().min(1, "Please select a discipline type"),
  matchType: z.enum(matchTypes, {
    errorMap: () => ({ message: "Please select a match type" })
  }),
  format: z.enum(tournamentFormats, {
    errorMap: () => ({ message: "Please select a tournament format" })
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  participants: z.string().min(1, "Number of participants is required"),
  prize: z.string().min(1, "Prize amount is required"),
  participationFee: z.string().min(1, "Entry fee is required"),
  description: z.string().min(1, "Description is required"),
  venueId: z.string().optional(),
  organizerDetails: z.object({
    contactPhone: z.string().min(1, "Contact phone is required"),
    website: z.string().optional()
  })
});

// Types
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;