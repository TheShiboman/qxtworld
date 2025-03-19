import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Trophy, TrendingUp } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Leaderboards & Rankings</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Global Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              International player rankings coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Regional & Club Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Local rankings and club standings coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Tournament Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Rankings based on tournament results coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Player Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed player stats and trends coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
