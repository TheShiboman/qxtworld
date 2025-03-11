import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tournaments, matches } from "@shared/schema";

export class TournamentService {
  static async startTournament(tournamentId: number): Promise<void> {
    try {
      // Get tournament
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Get and validate participants
      const registrations = await storage.getTournamentRegistrations(tournamentId);
      if (registrations.length < 2) {
        throw new Error("Not enough participants to start tournament");
      }

      // Get participant details
      const participants = await Promise.all(
        registrations.map(reg => storage.getUser(reg.userId))
      );

      const validParticipants = participants.filter((p): p is User => p !== null);
      if (validParticipants.length < 2) {
        throw new Error("Not enough valid participants");
      }

      // Create first round matches
      const match = {
        tournamentId,
        player1Id: validParticipants[0].id,
        player2Id: validParticipants[1].id,
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
        frameCount: 5, // Default to best of 5
        canDraw: false // Default to no draws
      };

      // Execute transaction
      await db.transaction(async (tx) => {
        // Update tournament status
        await tx.update(tournaments)
          .set({ status: 'in_progress' })
          .where(eq(tournaments.id, tournamentId));

        // Create first match
        await tx.insert(matches).values(match);
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

      // Only admins can edit locked/completed matches
      if (match.isLocked && userRole !== 'admin') {
        throw new Error("Match is locked. Only administrators can edit locked matches.");
      }

      // Only admins and referees can update scores
      if ((data.score1 !== undefined || data.score2 !== undefined) && 
          userRole !== 'admin' && userRole !== 'referee') {
        throw new Error("Only administrators and referees can update match scores.");
      }

      // Determine winner or draw
      let winner: number | null = null;
      if (!data.canDraw || data.score1 !== data.score2) {
        winner = data.score1 > data.score2 ? match.player1Id : match.player2Id;
      }

      await db.transaction(async (tx) => {
        // Update match
        await tx.update(matches)
          .set({
            ...data,
            winner,
            lastEditedBy: userId,
            lastEditedAt: new Date(),
            // Only set status to completed if scores are being updated
            ...(data.score1 !== undefined ? { status: 'completed' } : {}),
          })
          .where(eq(matches.id, matchId));

        // If we have a winner and next match exists, update it
        if (winner && match.nextMatchNumber) {
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