import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tournaments, matches } from "@shared/schema";

export class TournamentService {
  static async startTournament(tournamentId: number): Promise<void> {
    try {
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Get and validate participants
      const registrations = await storage.getTournamentRegistrations(tournamentId);
      if (registrations.length < 2) {
        throw new Error("Not enough participants to start tournament");
      }

      const participants = await Promise.all(
        registrations.map(reg => storage.getUser(reg.userId))
      );

      const validParticipants = participants.filter((p): p is User => p !== null);
      if (validParticipants.length < 2) {
        throw new Error("Not enough valid participants");
      }

      // Create first round matches
      const rounds = Math.ceil(Math.log2(validParticipants.length));
      const totalMatches = Math.pow(2, rounds) - 1;
      const firstRoundMatches = [];

      for (let i = 0; i < validParticipants.length; i += 2) {
        const matchNumber = Math.floor(i / 2) + 1;
        firstRoundMatches.push({
          tournamentId,
          player1Id: validParticipants[i].id,
          player2Id: i + 1 < validParticipants.length ? validParticipants[i + 1].id : 0,
          round: 1,
          matchNumber,
          nextMatchNumber: Math.floor((matchNumber - 1) / 2) + Math.pow(2, rounds - 2) + 1,
          status: 'scheduled',
          score1: 0,
          score2: 0,
          startTime: new Date(tournament.startDate),
          endTime: null,
          winner: null,
          isWinnersBracket: true,
          frameCount: 5, // Default frame count
          canDraw: true, // Allow draws by default
          tableNumber: null,
          refereeId: null,
          notes: ''
        });
      }

      await db.transaction(async (tx) => {
        // Update tournament status and structure
        await tx.update(tournaments)
          .set({
            status: 'in_progress',
            currentRound: 1,
            totalRounds: rounds,
            bracket: firstRoundMatches
          })
          .where(eq(tournaments.id, tournamentId));

        // Create all matches
        for (const match of firstRoundMatches) {
          await tx.insert(matches).values(match);
        }
      });

    } catch (error) {
      console.error('[startTournament] Error:', error);
      throw error;
    }
  }

  static async updateMatchResult(
    matchId: number,
    data: {
      score1: number;
      score2: number;
      frameCount?: number;
      refereeId?: number;
      startTime?: Date;
      canDraw?: boolean;
      tableNumber?: number;
      notes?: string;
    },
    userId: number,
    userRole: string
  ): Promise<void> {
    try {
      const match = await storage.getMatch(matchId);
      if (!match) {
        throw new Error("Match not found");
      }

      // Only admins and referees can update scores
      if ((data.score1 !== undefined || data.score2 !== undefined) && 
          userRole !== 'admin' && userRole !== 'referee') {
        throw new Error("Only administrators and referees can update match scores.");
      }

      // Determine winner or draw
      let winner: number | null = null;
      if (data.canDraw && data.score1 === data.score2) {
        winner = null; // This is a draw
      } else {
        winner = data.score1 > data.score2 ? match.player1Id : match.player2Id;
      }

      await db.transaction(async (tx) => {
        // Update match with new data
        await tx.update(matches)
          .set({
            ...data,
            winner,
            lastEditedBy: userId,
            lastEditedAt: new Date(),
          })
          .where(eq(matches.id, matchId));

        // If we have a winner and next match exists, update it
        if (winner !== null && match.nextMatchNumber) {
          const nextMatch = await storage.getMatchByNumber(match.tournamentId, match.nextMatchNumber);
          if (nextMatch) {
            await tx.update(matches)
              .set(nextMatch.player1Id === 0 
                ? { player1Id: winner }
                : { player2Id: winner })
              .where(eq(matches.id, nextMatch.id));
          }
        }
      });

    } catch (error) {
      console.error('[updateMatchResult] Error:', error);
      throw error;
    }
  }
  static async lockMatch(matchId: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new Error("Only administrators can lock matches");
    }

    await db.update(matches)
      .set({ isLocked: true })
      .where(eq(matches.id, matchId));
  }

  static async unlockMatch(matchId: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new Error("Only administrators can unlock matches");
    }

    await db.update(matches)
      .set({ isLocked: false })
      .where(eq(matches.id, matchId));
  }
}