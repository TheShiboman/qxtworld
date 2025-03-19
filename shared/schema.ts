import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const matchStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const;
export type MatchStatus = typeof matchStatuses[number];

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  score1: integer("score1").default(0),
  score2: integer("score2").default(0),
  status: text("status", { enum: matchStatuses }).notNull().default('scheduled'),
  round: integer("round").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  winner: integer("winner"),
  matchNumber: integer("match_number").notNull(),
  nextMatchNumber: integer("next_match_number"), 
  isWinnersBracket: boolean("is_winners_bracket").default(true),
  // Match management fields
  frameCount: integer("frame_count").default(5),
  refereeId: integer("referee_id"),
  canDraw: boolean("can_draw").default(false),
  tableNumber: integer("table_number"),
  lastEditedBy: integer("last_edited_by"),
  lastEditedAt: timestamp("last_edited_at"),
  notes: text("notes"),
  isLocked: boolean("is_locked").default(false)
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  organizerId: integer("organizer_id").notNull(), // Reference to users table
  venueId: integer("venue_id"), // Reference to venues table
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"),
  format: text("format").notNull(),
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

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  stock: integer("stock").notNull()
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tournamentId: integer("tournament_id").notNull(),
  predictedWinnerId: integer("predicted_winner_id").notNull(),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"), 
  registeredAt: timestamp("registered_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  facilities: jsonb("facilities").notNull().default([]),
  rating: integer("rating"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    fullName: true,
    email: true,
    role: true
  })
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const insertTournamentSchema = createInsertSchema(tournaments).extend({
  registrationDeadline: z.string().transform((str) => new Date(str)),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  prize: z.string().transform((str) => parseInt(str, 10)),
  participationFee: z.string().transform((str) => parseInt(str, 10)),
  participants: z.string().transform((str) => parseInt(str, 10)),
  organizerDetails: z.object({
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().optional(),
    website: z.string().url("Invalid website URL").optional()
  }),
  prizeBreakdown: z.array(z.object({
    position: z.string(),
    amount: z.number()
  })).optional(),
  rules: z.array(z.string()).optional()
});

export const insertMatchSchema = createInsertSchema(matches);
export const insertProductSchema = createInsertSchema(products);
export const insertPredictionSchema = createInsertSchema(predictions).omit({
  points: true,
  createdAt: true,
  updatedAt: true
});

export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).omit({
  registeredAt: true,
  updatedAt: true
});

export const insertVenueSchema = createInsertSchema(venues);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;