import { Match, Tournament } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface BracketProps {
  tournament: Tournament;
}

interface MatchWithPlayers extends Match {
  player1?: { id: number; fullName: string } | null;
  player2?: { id: number; fullName: string } | null;
}

export default function Bracket({ tournament }: BracketProps) {
  const { data: matches = [], isLoading } = useQuery<MatchWithPlayers[]>({
    queryKey: [`/api/tournaments/${tournament.id}/matches`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group matches by round
  const matchesByRound = matches.reduce((acc: MatchWithPlayers[][], match) => {
    const roundIndex = match.round - 1;
    if (!acc[roundIndex]) {
      acc[roundIndex] = [];
    }
    acc[roundIndex].push(match);
    return acc;
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-[800px]">
        {matchesByRound.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className="flex flex-col gap-8"
            style={{
              marginTop: `${roundIndex * 32}px`
            }}
          >
            <div className="mb-4 text-sm font-medium text-muted-foreground">
              Round {roundIndex + 1}
            </div>
            {round.map((match) => (
              <Card
                key={match.id}
                className={`w-64 ${match.status === 'completed' ? 'border-primary/50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${match.winner === match.player1Id ? 'bg-primary/10' : ''}`}>
                      <p className="font-medium">
                        {match.player1?.fullName || 'TBD'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {match.score1}
                      </p>
                    </div>
                    <div className={`p-2 rounded ${match.winner === match.player2Id ? 'bg-primary/10' : ''}`}>
                      <p className="font-medium">
                        {match.player2?.fullName || 'TBD'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {match.score2}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {match.status === 'scheduled' && match.startTime && (
                        <>Scheduled: {new Date(match.startTime).toLocaleString()}</>
                      )}
                      {match.status === 'in_progress' && (
                        <span className="text-primary">In Progress</span>
                      )}
                      {match.status === 'completed' && (
                        <span className="text-green-600">Completed</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}