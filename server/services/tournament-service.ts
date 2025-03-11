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

      // Create matches for first round
      const initialMatches = [];
      for (let i = 0; i < validParticipants.length; i += 2) {
        initialMatches.push({
          tournamentId,
          player1Id: validParticipants[i].id,
          player2Id: i + 1 < validParticipants.length ? validParticipants[i + 1].id : 0,
          round: 1,
          matchNumber: Math.floor(i / 2) + 1,
          nextMatchNumber: Math.ceil((i + 2) / 4),
          status: 'scheduled',
          score1: 0,
          score2: 0,
          startTime: new Date(tournament.startDate),
          endTime: null,
          winner: null,
          isWinnersBracket: true
        });
      }

      // Execute transaction
      await db.transaction(async (tx) => {
        // Update tournament status
        await tx.update(tournaments)
          .set({
            status: 'in_progress',
            currentRound: 1,
            totalRounds: Math.ceil(Math.log2(validParticipants.length))
          })
          .where(eq(tournaments.id, tournamentId));

        // Create matches
        for (const match of initialMatches) {
          await tx.insert(matches).values(match);
        }
      });

    } catch (error) {
      console.error('[startTournament] Error:', error);
      throw error;
    }
  }

  static async updateMatchResult(matchId: number, score1: number, score2: number): Promise<void> {
    try {
      // Get current match
      const match = await storage.getMatch(matchId);
      if (!match) {
        throw new Error("Match not found");
      }

      // Determine winner
      const winner = score1 > score2 ? match.player1Id : match.player2Id;

      // Update match result
      await db.transaction(async (tx) => {
        // Update current match
        await tx.update(matches)
          .set({
            score1,
            score2,
            winner,
            status: 'completed',
            endTime: new Date()
          })
          .where(eq(matches.id, matchId));

        // If there's a next match, update it
        if (match.nextMatchNumber) {
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