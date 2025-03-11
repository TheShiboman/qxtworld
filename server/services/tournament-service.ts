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

      // Create initial match
      const match = {
        tournamentId,
        player1Id: 0,
        player2Id: 0,
        round: 1,
        matchNumber: 1,
        nextMatchNumber: 0,
        status: 'scheduled',
        score1: 0,
        score2: 0,
        startTime: new Date(tournament.startDate),
        endTime: null,
        winner: null,
        isWinnersBracket: true,
        frameCount: 5,
        refereeId: null,
        canDraw: true,
        tableNumber: null,
        lastEditedBy: null,
        lastEditedAt: null,
        notes: '',
        isLocked: false
      };

      await db.transaction(async (tx) => {
        // Update tournament status
        await tx.update(tournaments)
          .set({ 
            status: 'in_progress',
            currentRound: 1,
            totalRounds: 1
          })
          .where(eq(tournaments.id, tournamentId));

        // Create initial match
        await tx.insert(matches).values([match]);
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
      } else if (data.score1 !== data.score2) {
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