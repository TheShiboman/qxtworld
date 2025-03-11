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

      // Create simple first round match
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
        isWinnersBracket: true
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

  static async updateMatchResult(matchId: number, score1: number, score2: number): Promise<void> {
    const match = await storage.getMatch(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    const winner = score1 > score2 ? match.player1Id : match.player2Id;

    await storage.updateMatch(matchId, {
      score1,
      score2,
      winner,
      status: 'completed',
      endTime: new Date()
    });

    if (match.nextMatchNumber) {
      const nextMatch = await storage.getMatchByNumber(match.tournamentId, match.nextMatchNumber);
      if (nextMatch) {
        const updateData = nextMatch.player1Id === 0 ?
          { player1Id: winner } :
          { player2Id: winner };
        await storage.updateMatch(nextMatch.id, updateData);
      }
    }
  }
}