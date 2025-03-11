import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";
import { db } from "../db";

export class TournamentService {
  static async generateMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    try {
      console.log(`[generateMatches] Starting match generation for tournament ${tournament.id}`);
      console.log(`[generateMatches] Format: ${tournament.format}, Participants: ${participants.length}`);

      let matches: Match[] = [];
      switch (tournament.format.toLowerCase()) {
        case 'single elimination':
          matches = await this.generateSingleEliminationMatches(tournament, participants);
          break;
        case 'round robin':
          matches = await this.generateRoundRobinMatches(tournament, participants);
          break;
        default:
          throw new Error(`Unsupported tournament format: ${tournament.format}`);
      }

      console.log(`[generateMatches] Successfully generated ${matches.length} matches`);
      return matches;
    } catch (error) {
      console.error('[generateMatches] Error:', error);
      throw error;
    }
  }

  private static async generateSingleEliminationMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    const matches: Match[] = [];
    const rounds = Math.ceil(Math.log2(participants.length));
    const firstRoundMatches = Math.ceil(participants.length / 2);

    // Generate first round matches
    for (let i = 0; i < participants.length; i += 2) {
      matches.push({
        id: 0,
        tournamentId: tournament.id,
        player1Id: participants[i]?.id || 0,
        player2Id: participants[i + 1]?.id || 0,
        score1: 0,
        score2: 0,
        round: 1,
        matchNumber: matches.length + 1,
        nextMatchNumber: Math.floor((matches.length + 1) / 2) + firstRoundMatches,
        status: 'scheduled',
        startTime: new Date(tournament.startDate),
        endTime: null,
        winner: null,
        isWinnersBracket: true
      });
    }

    // Generate subsequent rounds
    let currentRound = 2;
    let matchesInCurrentRound = firstRoundMatches / 2;

    while (matchesInCurrentRound >= 1) {
      for (let i = 0; i < matchesInCurrentRound; i++) {
        matches.push({
          id: 0,
          tournamentId: tournament.id,
          player1Id: 0,
          player2Id: 0,
          score1: 0,
          score2: 0,
          round: currentRound,
          matchNumber: matches.length + 1,
          nextMatchNumber: currentRound === rounds ? 0 : Math.floor((matches.length + 1) / 2) + Math.ceil(matchesInCurrentRound / 2),
          status: 'scheduled',
          startTime: new Date(tournament.startDate),
          endTime: null,
          winner: null,
          isWinnersBracket: true
        });
      }
      currentRound++;
      matchesInCurrentRound = Math.floor(matchesInCurrentRound / 2);
    }

    return matches;
  }

  private static async generateRoundRobinMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    const matches: Match[] = [];
    const players = [...participants];

    if (players.length % 2 === 1) {
      players.push({ id: 0 } as User); // Add bye player
    }

    const rounds = players.length - 1;
    const matchesPerRound = Math.floor(players.length / 2);

    for (let round = 0; round < rounds; round++) {
      const roundStartTime = new Date(tournament.startDate);
      roundStartTime.setDate(roundStartTime.getDate() + round);

      for (let match = 0; match < matchesPerRound; match++) {
        const firstPlayer = players[match];
        const secondPlayer = players[players.length - 1 - match];

        if (firstPlayer.id === 0 || secondPlayer.id === 0) continue;

        matches.push({
          id: 0,
          tournamentId: tournament.id,
          player1Id: firstPlayer.id,
          player2Id: secondPlayer.id,
          score1: 0,
          score2: 0,
          round: round + 1,
          matchNumber: matches.length + 1,
          nextMatchNumber: 0,
          status: 'scheduled',
          startTime: roundStartTime,
          endTime: null,
          winner: null,
          isWinnersBracket: true
        });
      }

      // Rotate players (keep first player fixed)
      players.splice(1, 0, players.pop()!);
    }

    return matches;
  }

  static async startTournament(tournamentId: number): Promise<void> {
    try {
      // Step 1: Get tournament and validate
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Step 2: Get and validate participants
      const registrations = await storage.getTournamentRegistrations(tournamentId);
      const confirmedParticipants = registrations.filter(reg => reg.status === 'confirmed');

      if (confirmedParticipants.length < 2) {
        throw new Error("At least 2 confirmed participants are required");
      }

      // Step 3: Get user details
      const participants = await Promise.all(
        confirmedParticipants.map(reg => storage.getUser(reg.userId))
      );
      const validParticipants = participants.filter((p): p is User => p !== null);

      if (validParticipants.length < 2) {
        throw new Error("At least 2 valid participants are required");
      }

      // Step 4: Generate matches
      const matches = tournament.format.toLowerCase() === 'single elimination'
        ? await this.generateSingleEliminationMatches(tournament, validParticipants)
        : await this.generateRoundRobinMatches(tournament, validParticipants);

      // Step 5: Start transaction
      return await db.transaction(async (tx) => {
        // Update tournament status
        await storage.updateTournament(tournamentId, {
          status: 'in_progress',
          currentRound: 1,
          totalRounds: Math.max(...matches.map(m => m.round)),
          roundStartTimes: matches.map(m => m.startTime).filter(Boolean)
        });

        // Create matches
        for (const match of matches) {
          await storage.createMatch({
            ...match,
            score1: 0,
            score2: 0,
            status: 'scheduled',
            startTime: new Date(tournament.startDate),
            endTime: null,
            winner: null,
            isWinnersBracket: true
          });
        }
      });
    } catch (error) {
      console.error("[startTournament] Error:", error);
      throw new Error(`Failed to start tournament: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  static async updateMatchResult(matchId: number, score1: number, score2: number): Promise<void> {
    const match = await storage.getMatch(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    const winner = score1 > score2 ? match.player1Id : match.player2Id;

    // Update match result
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
        // Update next match with winner
        const updateData = nextMatch.player1Id === 0 ?
          { player1Id: winner } :
          { player2Id: winner };
        await storage.updateMatch(nextMatch.id, updateData);
      }
    }
  }
}