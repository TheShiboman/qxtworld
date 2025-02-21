import { Match, Tournament } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface BracketProps {
  tournament: Tournament;
}

export default function Bracket({ tournament }: BracketProps) {
  const bracket = tournament.bracket as Match[][];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-[800px]">
        {bracket.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className="flex flex-col gap-8"
            style={{
              marginTop: `${roundIndex * 32}px`
            }}
          >
            {round.map((match, matchIndex) => (
              <Card
                key={match.id}
                className="w-64"
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${match.winner === match.player1Id ? 'bg-primary/10' : ''}`}>
                      <p className="font-medium">{match.player1Id}</p>
                      <p className="text-sm text-muted-foreground">{match.score1}</p>
                    </div>
                    <div className={`p-2 rounded ${match.winner === match.player2Id ? 'bg-primary/10' : ''}`}>
                      <p className="font-medium">{match.player2Id}</p>
                      <p className="text-sm text-muted-foreground">{match.score2}</p>
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
