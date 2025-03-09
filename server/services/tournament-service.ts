import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";

export class TournamentService {
  static async generateMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    switch (tournament.format.toLowerCase()) {
      case 'single elimination':
        return this.generateSingleEliminationMatches(tournament, participants);
      case 'round robin':
        return this.generateRoundRobinMatches(tournament, participants);
      default:
        throw new Error(`Unsupported tournament format: ${tournament.format}`);
    }
  }

  private static async generateSingleEliminationMatches(tournament: Tournament, participants: User[]): Promise<Match[]> {
    const matches: Match[] = [];
    const rounds = Math.ceil(Math.log2(participants.length));
    const firstRoundMatches = Math.ceil(participants.length / 2);
    const totalMatches = Math.pow(2, rounds) - 1;

    // First round matches
    for (let i = 0; i < participants.length; i += 2) {
      const player1 = participants[i];
      const player2 = participants[i + 1];
      const matchNumber = matches.length + 1;
      const nextMatchNumber = Math.floor(matchNumber / 2) + firstRoundMatches;

      matches.push({
        tournamentId: tournament.id,
        player1Id: player1?.id ?? 0, // Bye if no player
        player2Id: player2?.id ?? 0,
        round: 1,
        matchNumber: matchNumber,
        nextMatchNumber: nextMatchNumber <= totalMatches ? nextMatchNumber : 0,
        status: 'scheduled',
        startTime: new Date(tournament.startDate),
        isWinnersBracket: true
      } as Match);
    }

    // Create subsequent round matches
    let currentRoundStartMatch = firstRoundMatches + 1;
    for (let round = 2; round <= rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        const matchNumber = currentRoundStartMatch + i;
        const nextMatchNumber = Math.floor(matchNumber / 2) + matchesInRound;

        matches.push({
          tournamentId: tournament.id,
          player1Id: 0, // To be determined
          player2Id: 0,
          round,
          matchNumber: matchNumber,
          nextMatchNumber: round === rounds ? 0 : nextMatchNumber,
          status: 'scheduled',
          startTime: new Date(tournament.startDate),
          isWinnersBracket: true
        } as Match);
      }
      currentRoundStartMatch += matchesInRound;
    }

    return matches;
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
          isWinnersBracket: true
        } as Match);
      }

      // Rotate players (keep first player fixed)
      players.splice(1, 0, players.pop()!);
    }

    return matches;
  }

  static async startTournament(tournamentId: number): Promise<void> {
    const tournament = await storage.getTournament(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }

    // Get all confirmed participants
    const registrations = await storage.getTournamentRegistrations(tournamentId);
    const participants = await Promise.all(
      registrations
        .filter(reg => reg.status === 'confirmed')
        .map(reg => storage.getUser(reg.userId))
    );

    // Generate matches based on tournament format
    const matches = await this.generateMatches(tournament, participants as User[]);

    // Save matches to database
    for (const match of matches) {
      await storage.createMatch(match);
    }

    // Update tournament status
    await storage.updateTournament(tournamentId, {
      status: 'in_progress',
      currentRound: 1,
      totalRounds: Math.max(...matches.map(m => m.round))
    });
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