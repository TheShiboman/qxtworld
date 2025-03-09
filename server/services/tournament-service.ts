import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";

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
    try {
      console.log(`[generateSingleEliminationMatches] Generating matches for ${participants.length} participants`);

      const matches: Match[] = [];
      const rounds = Math.ceil(Math.log2(participants.length));
      const firstRoundMatches = Math.ceil(participants.length / 2);
      const totalMatches = Math.pow(2, rounds) - 1;

      console.log(`[generateSingleEliminationMatches] Tournament structure: ${rounds} rounds, ${totalMatches} total matches`);

      // Generate first round matches
      for (let i = 0; i < participants.length; i += 2) {
        const player1 = participants[i];
        const player2 = participants[i + 1];
        const matchNumber = matches.length + 1;
        const nextMatchNumber = Math.floor(matchNumber / 2) + firstRoundMatches;

        const match: Match = {
          id: 0,
          tournamentId: tournament.id,
          player1Id: player1?.id ?? 0,
          player2Id: player2?.id ?? 0,
          score1: 0,
          score2: 0,
          round: 1,
          matchNumber,
          nextMatchNumber: nextMatchNumber <= totalMatches ? nextMatchNumber : 0,
          status: 'scheduled',
          startTime: new Date(tournament.startDate),
          isWinnersBracket: true,
          endTime: null,
          winner: null
        };

        matches.push(match);
      }

      // Create subsequent round matches
      let currentRoundStartMatch = firstRoundMatches + 1;
      for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.pow(2, rounds - round);
        for (let i = 0; i < matchesInRound; i++) {
          const matchNumber = currentRoundStartMatch + i;
          const nextMatchNumber = round === rounds ? 0 : Math.floor(matchNumber / 2) + matchesInRound;

          const match: Match = {
            id: 0,
            tournamentId: tournament.id,
            player1Id: 0,
            player2Id: 0,
            score1: 0,
            score2: 0,
            round,
            matchNumber,
            nextMatchNumber,
            status: 'scheduled',
            startTime: new Date(tournament.startDate),
            isWinnersBracket: true,
            endTime: null,
            winner: null
          };

          matches.push(match);
        }
        currentRoundStartMatch += matchesInRound;
      }

      console.log(`[generateSingleEliminationMatches] Generated ${matches.length} matches successfully`);
      return matches;
    } catch (error) {
      console.error('[generateSingleEliminationMatches] Error:', error);
      throw error;
    }
  }

  private static async generateRoundRobinMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    const matches: Match[] = [];
    const n = participants.length;

    // For odd number of participants, add a "bye" player
    const players = [...participants];
    if (n % 2 === 1) {
      players.push({ id: 0 } as User); // Bye player
    }

    const rounds = players.length - 1;
    const matchesPerRound = players.length / 2;

    for (let round = 0; round < rounds; round++) {
      const roundStartTime = new Date(tournament.startDate);
      roundStartTime.setDate(roundStartTime.getDate() + round);

      for (let match = 0; match < matchesPerRound; match++) {
        const player1Index = match;
        const player2Index = players.length - 1 - match;

        // Skip matches involving the "bye" player
        if (players[player1Index].id === 0 || players[player2Index].id === 0) {
          continue;
        }

        matches.push({
          tournamentId: tournament.id,
          player1Id: players[player1Index].id,
          player2Id: players[player2Index].id,
          round: round + 1,
          matchNumber: matches.length + 1,
          status: 'scheduled',
          startTime: roundStartTime,
          isWinnersBracket: true,
          score1: 0,
          score2: 0,
          id: 0,
          endTime: null,
          winner: null
        } as Match);
      }

      // Rotate players (keep first player fixed)
      players.splice(1, 0, players.pop()!);
    }

    return matches;
  }

  static async startTournament(tournamentId: number): Promise<void> {
    try {
      console.log(`[startTournament] Starting tournament ${tournamentId}`);

      // Get tournament
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        throw new Error("Tournament not found");
      }
      console.log(`[startTournament] Found tournament: ${tournament.name}`);

      // Get registrations
      const registrations = await storage.getTournamentRegistrations(tournamentId);
      console.log(`[startTournament] Found ${registrations.length} registrations`);

      const confirmedParticipants = registrations.filter(reg => reg.status === 'confirmed');
      console.log(`[startTournament] Found ${confirmedParticipants.length} confirmed participants`);

      if (confirmedParticipants.length < 2) {
        throw new Error("Not enough confirmed participants to start the tournament");
      }

      // Get participant details
      const participants = await Promise.all(
        confirmedParticipants.map(async reg => {
          try {
            const user = await storage.getUser(reg.userId);
            console.log(`[startTournament] Found user ${user?.username} (ID: ${reg.userId})`);
            return user;
          } catch (error) {
            console.error(`[startTournament] Failed to get user ${reg.userId}:`, error);
            return null;
          }
        })
      );

      const validParticipants = participants.filter((p): p is User => p !== null);
      console.log(`[startTournament] Found ${validParticipants.length} valid participants`);

      if (validParticipants.length < 2) {
        throw new Error("Not enough valid participants to start the tournament");
      }

      // Generate matches
      const matches = await this.generateMatches(tournament, validParticipants);
      if (!matches || matches.length === 0) {
        throw new Error("Failed to generate matches");
      }

      // Calculate rounds
      const totalRounds = Math.max(...matches.map(m => m.round));
      console.log(`[startTournament] Tournament will have ${totalRounds} rounds`);

      try {
        // Update tournament status first
        console.log('[startTournament] Updating tournament status');
        await storage.updateTournament(tournamentId, {
          status: 'in_progress',
          currentRound: 1,
          totalRounds,
          roundStartTimes: matches.map(m => m.startTime)
        });

        // Then create matches
        console.log('[startTournament] Creating matches in database');
        for (const match of matches) {
          const createdMatch = await storage.createMatch(match);
          console.log(`[startTournament] Created match ID ${createdMatch.id} (Round ${match.round}, Players: ${match.player1Id} vs ${match.player2Id})`);
        }

        console.log(`[startTournament] Tournament ${tournamentId} started successfully`);
      } catch (error) {
        // If match creation fails, revert tournament status
        console.error('[startTournament] Failed to create matches:', error);
        await storage.updateTournament(tournamentId, {
          status: 'upcoming',
          currentRound: 0,
          totalRounds: 0,
          roundStartTimes: []
        });
        throw error;
      }
    } catch (error) {
      console.error('[startTournament] Tournament start failed:', error);
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