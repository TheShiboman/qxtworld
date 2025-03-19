import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Video, Newspaper, Swords, Award, BadgeCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Community & Social Hub</h1>

      {/* Player Challenges Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Player Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Friendly Match Challenge</p>
                      <p className="text-sm text-muted-foreground">From: John Smith</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Accept</Button>
                      <Button variant="ghost" size="sm">Decline</Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Best of 3 frames - Snooker</p>
                </div>
                <Button className="w-full">Create New Challenge</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Challenge History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium">vs. Mike Johnson</p>
                    <p className="text-sm text-muted-foreground">Won 2-1</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium">vs. Sarah Williams</p>
                    <p className="text-sm text-muted-foreground">Lost 1-2</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Achievements & Badges</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <BadgeCheck className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium">Century Break</p>
                    <p className="text-sm text-muted-foreground">Break of 100+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Tournament Victor</p>
                    <p className="text-sm text-muted-foreground">Won first tournament</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">Matches Played</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold">28/50</p>
                    <p className="text-sm text-muted-foreground">Next: Veteran Badge</p>
                  </div>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">Tournament Wins</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold">3/5</p>
                    <p className="text-sm text-muted-foreground">Next: Champion Badge</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Badge Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs">Elite</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs">Pro</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs">Veteran</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs">Rookie</p>
                </div>
                <div className="text-center opacity-50">
                  <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs">Locked</p>
                </div>
                <div className="text-center opacity-50">
                  <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Original Community Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Discussion Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Join topic-based cue sports discussions coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Content Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Share your match highlights and best shots coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              News & Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Latest cue sports news and insights coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}