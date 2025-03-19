import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Trophy, TrendingUp, BarChart, Activity, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Leaderboards & Rankings</h1>

      <div className="space-y-8">
        {/* Main Rankings */}
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
        </div>

        {/* Performance Hub */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tournament">Tournament Stats</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Win Rate</p>
                    <p className="text-2xl font-bold">76%</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Average Break</p>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tournament Wins</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">This season</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tournament">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">QXT Spring Championship</p>
                      <p className="text-sm text-muted-foreground">Quarter-finalist</p>
                    </div>
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">Club Masters Series</p>
                      <p className="text-sm text-muted-foreground">Winner</p>
                    </div>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <p className="font-medium">Pot Success Rate</p>
                      </div>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-4 w-4 text-primary" />
                        <p className="font-medium">Safety Play Success</p>
                      </div>
                      <p className="text-2xl font-bold">71%</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed performance metrics and trend analysis coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}