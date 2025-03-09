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

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
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
  bracket: jsonb("bracket").notNull().default([])
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  score1: integer("score1").default(0),
  score2: integer("score2").default(0),
  status: text("status").notNull().default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  winner: integer("winner")
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
  participants: z.string().transform((str) => parseInt(str, 10))
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