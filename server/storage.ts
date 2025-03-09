import { users, tournaments, matches, products, predictions } from "@shared/schema";
import type { InsertUser, User, Tournament, Match, Product, InsertPrediction, Prediction } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User>; // Added updateUser method

  // Tournament operations
  createTournament(tournament: Tournament): Promise<Tournament>;
  getTournament(id: number): Promise<Tournament | undefined>;
  listTournaments(): Promise<Tournament[]>;
  updateTournament(id: number, data: Partial<Tournament>): Promise<Tournament>;

  // Match operations
  createMatch(match: Match): Promise<Match>;
  updateMatch(id: number, data: Partial<Match>): Promise<Match>;
  getMatch(id: number): Promise<Match | undefined>;
  getMatchesByTournament(tournamentId: number): Promise<Match[]>;

  // Product operations
  createProduct(product: Product): Promise<Product>;
  getProduct(id: number): Promise<Product | undefined>;
  listProducts(): Promise<Product[]>;

  // Prediction operations
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getUserPredictions(userId: number): Promise<Prediction[]>;
  getTournamentPredictions(tournamentId: number): Promise<Prediction[]>;
  getLeaderboard(tournamentId: number): Promise<Array<{ user: User; points: number }>>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'user_sessions',
      schemaName: 'public',
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
      errorLog: console.error.bind(console), // Log session store errors
      ssl: process.env.NODE_ENV === 'production'
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async listUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createTournament(tournament: Tournament): Promise<Tournament> {
    const [created] = await db.insert(tournaments).values(tournament).returning();
    return created;
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async listTournaments(): Promise<Tournament[]> {
    return db.select().from(tournaments);
  }

  async updateTournament(id: number, data: Partial<Tournament>): Promise<Tournament> {
    const [updated] = await db
      .update(tournaments)
      .set(data)
      .where(eq(tournaments.id, id))
      .returning();
    return updated;
  }

  async createMatch(match: Match): Promise<Match> {
    const [created] = await db.insert(matches).values(match).returning();
    return created;
  }

  async updateMatch(id: number, data: Partial<Match>): Promise<Match> {
    const [updated] = await db
      .update(matches)
      .set(data)
      .where(eq(matches.id, id))
      .returning();
    return updated;
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    return db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
  }

  async createProduct(product: Product): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async listProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [created] = await db.insert(predictions).values({
      ...prediction,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return created;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction;
  }

  async getUserPredictions(userId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.userId, userId));
  }

  async getTournamentPredictions(tournamentId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.tournamentId, tournamentId));
  }

  async getLeaderboard(tournamentId: number): Promise<Array<{ user: User; points: number }>> {
    try {
      const tournamentPredictions = await this.getTournamentPredictions(tournamentId);
      const userPoints = new Map<number, number>();

      for (const prediction of tournamentPredictions) {
        const currentPoints = userPoints.get(prediction.userId) || 0;
        userPoints.set(prediction.userId, currentPoints + (prediction.points || 0));
      }

      const leaderboardEntries = await Promise.all(
        Array.from(userPoints.entries()).map(async ([userId, points]) => {
          const user = await this.getUser(userId);
          if (!user) {
            // Skip entries where user doesn't exist
            return null;
          }
          return { user, points };
        })
      );

      // Filter out null entries and sort by points
      return leaderboardEntries
        .filter((entry): entry is { user: User; points: number } => entry !== null)
        .sort((a, b) => b.points - a.points);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> { // Added updateUser method implementation
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();