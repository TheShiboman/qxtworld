import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

// Basic enums
export const cueSportsDisciplines = ['Snooker', 'American Pool', 'Billiards', 'Black Ball', 'Chinese Pool', 'Carom', 'Russian Pyramid'] as const;
export const matchTypes = ['Single', 'Doubles', 'Scottish Doubles', 'Mixed Doubles', 'Teams'] as const;
export const tournamentFormats = ['Round Robin', 'Single Elimination', 'Double Elimination', 'Multi-Stage', 'Swiss System', 'Custom Format'] as const;

// Type exports
export type CueSportsDiscipline = typeof cueSportsDisciplines[number];
export type MatchType = typeof matchTypes[number];
export type TournamentFormat = typeof tournamentFormats[number];

// Database schema
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  discipline: text("discipline", { enum: cueSportsDisciplines }).notNull(),
  disciplineType: text("discipline_type").notNull(),
  matchType: text("matchType", { enum: matchTypes }).notNull(),
  organizerId: integer("organizer_id").notNull(),
  venueId: integer("venue_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  status: text("status").notNull().default("upcoming"),
  format: text("format", { enum: tournamentFormats }).notNull(),
  participants: integer("participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  prize: integer("prize").notNull(),
  participationFee: integer("participation_fee").notNull().default(0),
  description: text("description").notNull(),
  currentRound: integer("current_round").default(1),
  bracket: jsonb("bracket").notNull().default([]),
  organizerDetails: jsonb("organizer_details").notNull()
});

// Basic form schema
export const insertTournamentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  discipline: z.enum(cueSportsDisciplines),
  disciplineType: z.string().min(1, "Discipline type is required"),
  matchType: z.enum(matchTypes),
  format: z.enum(tournamentFormats),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  participants: z.number().int().min(2, "At least 2 participants required"),
  prize: z.number().int().min(0, "Prize cannot be negative"),
  participationFee: z.number().int().min(0, "Fee cannot be negative"),
  description: z.string().min(1, "Description is required"),
  venueId: z.number().optional(),
  organizerDetails: z.object({
    contactPhone: z.string().min(1, "Contact phone is required"),
    website: z.string().optional()
  })
});

// Types
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;