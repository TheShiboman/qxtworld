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
  type: text("type").notNull(), // snooker, pool, etc
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"),
  format: text("format").notNull(), // single elimination, double elimination
  participants: integer("participants").notNull(),
  prize: integer("prize").notNull(),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true
});

export const insertTournamentSchema = createInsertSchema(tournaments);
export const insertMatchSchema = createInsertSchema(matches);
export const insertProductSchema = createInsertSchema(products);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Product = typeof products.$inferSelect;
