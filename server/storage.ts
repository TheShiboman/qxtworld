import { users, tournaments, matches, products } from "@shared/schema";
import type { InsertUser, User, Tournament, Match, Product, InsertPrediction, Prediction } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>; // Added listUsers method

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tournaments: Map<number, Tournament>;
  private matches: Map<number, Match>;
  private products: Map<number, Product>;
  private predictions: Map<number, Prediction>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.matches = new Map();
    this.products = new Map();
    this.predictions = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      rating: 1500,
      createdAt: new Date(),
    } as User;
    this.users.set(id, user);
    return user;
  }

  async createTournament(tournament: Tournament): Promise<Tournament> {
    const id = this.currentId++;
    this.tournaments.set(id, { ...tournament, id });
    return this.tournaments.get(id)!;
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async listTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async updateTournament(id: number, data: Partial<Tournament>): Promise<Tournament> {
    const tournament = this.tournaments.get(id);
    if (!tournament) throw new Error("Tournament not found");
    const updated = { ...tournament, ...data };
    this.tournaments.set(id, updated);
    return updated;
  }

  async createMatch(match: Match): Promise<Match> {
    const id = this.currentId++;
    this.matches.set(id, { ...match, id });
    return this.matches.get(id)!;
  }

  async updateMatch(id: number, data: Partial<Match>): Promise<Match> {
    const match = this.matches.get(id);
    if (!match) throw new Error("Match not found");
    const updated = { ...match, ...data };
    this.matches.set(id, updated);
    return updated;
  }

  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      (match) => match.tournamentId === tournamentId
    );
  }

  async createProduct(product: Product): Promise<Product> {
    const id = this.currentId++;
    this.products.set(id, { ...product, id });
    return this.products.get(id)!;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async listProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentId++;
    const newPrediction = {
      ...prediction,
      id,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Prediction;
    this.predictions.set(id, newPrediction);
    return newPrediction;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getUserPredictions(userId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (prediction) => prediction.userId === userId
    );
  }

  async getTournamentPredictions(tournamentId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (prediction) => prediction.tournamentId === tournamentId
    );
  }

  async getLeaderboard(tournamentId: number): Promise<Array<{ user: User; points: number }>> {
    const predictions = await this.getTournamentPredictions(tournamentId);
    const userPoints = new Map<number, number>();

    for (const prediction of predictions) {
      const currentPoints = userPoints.get(prediction.userId) || 0;
      userPoints.set(prediction.userId, currentPoints + prediction.points);
    }

    const leaderboardEntries = await Promise.all(
      Array.from(userPoints.entries()).map(async ([userId, points]) => {
        const user = await this.getUser(userId);
        return { user: user!, points };
      })
    );

    return leaderboardEntries.sort((a, b) => b.points - a.points);
  }
}

export const storage = new MemStorage();