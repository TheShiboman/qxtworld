import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Trophy, TrendingUp, BarChart, Activity, Target, DollarSign, Users, Star, Link, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#c4a45b]">Leaderboards & Rankings</h1>

      <div className="space-y-8">
        {/* Main Rankings */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#c4a45b]" />
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
                <MapPin className="h-5 w-5 text-[#c4a45b]" />
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
              <Activity className="h-5 w-5 text-[#c4a45b]" />
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
                    <p className="text-sm font-medium text-[#c4a45b]">Win Rate</p>
                    <p className="text-2xl font-bold">76%</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#c4a45b]">Average Break</p>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#c4a45b]">Tournament Wins</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">This season</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tournament">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium text-[#c4a45b]">QXT Spring Championship</p>
                      <p className="text-sm text-muted-foreground">Quarter-finalist</p>
                    </div>
                    <Trophy className="h-5 w-5 text-[#c4a45b]" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium text-[#c4a45b]">Club Masters Series</p>
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
                        <Target className="h-4 w-4 text-[#c4a45b]" />
                        <p className="font-medium text-[#c4a45b]">Pot Success Rate</p>
                      </div>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-4 w-4 text-[#c4a45b]" />
                        <p className="font-medium text-[#c4a45b]">Safety Play Success</p>
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

        {/* Sponsorship Hub */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#c4a45b]">Sponsorship Hub</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sponsored Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#c4a45b]" />
                  Featured Sponsored Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#c4a45b]">James Wilson</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Rising Star</Badge>
                          <Badge className="bg-[#c4a45b]/10 text-[#c4a45b]">QXT Sponsored</Badge>
                        </div>
                      </div>
                      <Link className="h-5 w-5 text-[#c4a45b]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <img src="/sponsor-logo-1.svg" alt="Sponsor 1" className="h-8" />
                      <img src="/sponsor-logo-2.svg" alt="Sponsor 2" className="h-8" />
                      <img src="/sponsor-logo-3.svg" alt="Sponsor 3" className="h-8" />
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#c4a45b]">Sarah Chen</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pro Player</Badge>
                          <Badge className="bg-yellow-500/10 text-yellow-500">Elite Sponsor</Badge>
                        </div>
                      </div>
                      <Link className="h-5 w-5 text-[#c4a45b]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <img src="/sponsor-logo-4.svg" alt="Sponsor 4" className="h-8" />
                      <img src="/sponsor-logo-5.svg" alt="Sponsor 5" className="h-8" />
                      <img src="/sponsor-logo-6.svg" alt="Sponsor 6" className="h-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsorship Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#c4a45b]" />
                  Sponsorship Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#c4a45b]">For Sponsors</p>
                        <p className="text-sm text-muted-foreground">Connect with top talent</p>
                      </div>
                      <Award className="h-5 w-5 text-[#c4a45b]" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-sm text-[#c4a45b]">Benefits:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Brand visibility on player profiles</li>
                        <li>Match highlight promotions</li>
                        <li>Tournament presence</li>
                        <li>Exclusive content rights</li>
                      </ul>
                    </div>
                    <Button className="w-full mt-4">Become a Sponsor</Button>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#c4a45b]">For Players</p>
                        <p className="text-sm text-muted-foreground">Get sponsored</p>
                      </div>
                      <Users className="h-5 w-5 text-[#c4a45b]" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-sm text-[#c4a45b]">Requirements:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Minimum ranking requirements</li>
                        <li>Active tournament participation</li>
                        <li>Social media presence</li>
                        <li>Professional conduct</li>
                      </ul>
                    </div>
                    <Button className="w-full mt-4">Apply for Sponsorship</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}