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
    }
  ): Promise<void> {
    try {
      // Get current match
      const match = await storage.getMatch(matchId);
      if (!match) {
        throw new Error("Match not found");
      }

      // Determine winner or draw
      let winner: number | null = null;
      if (!data.canDraw) {
        winner = data.score1 > data.score2 ? match.player1Id : match.player2Id;
      } else if (data.score1 === data.score2) {
        winner = null; // Draw
      } else {
        winner = data.score1 > data.score2 ? match.player1Id : match.player2Id;
      }

      // Update match result
      await db.transaction(async (tx) => {
        // Update current match
        await tx.update(matches)
          .set({
            score1: data.score1,
            score2: data.score2,
            frameCount: data.frameCount,
            refereeId: data.refereeId,
            startTime: data.startTime,
            canDraw: data.canDraw,
            winner,
            status: 'completed',
            endTime: new Date()
          })
          .where(eq(matches.id, matchId));

        // If there's a next match and we have a winner, update it
        if (match.nextMatchNumber && winner) {
          const nextMatch = await storage.getMatchByNumber(match.tournamentId, match.nextMatchNumber);
          if (nextMatch) {
            // Update next match with winner
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
}