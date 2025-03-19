import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Video, Newspaper, Swords, Award, BadgeCheck, Trophy, MapPin, Search, Heart, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

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

      {/* Clubs & Venues Directory */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Clubs & Venues</h2>
        <div className="space-y-6">
          {/* Search & Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Find Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Search by location or name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Facilities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="snooker">Snooker Tables</SelectItem>
                    <SelectItem value="pool">Pool Tables</SelectItem>
                    <SelectItem value="coaching">Coaching Available</SelectItem>
                    <SelectItem value="tournament">Tournament Venue</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Venue Listings */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Elite Snooker Club</CardTitle>
                  <Badge className="bg-primary/10">Official Partner</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Downtown Sports Complex</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8/5 (124 reviews)</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Facilities:</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">12 Snooker Tables</Badge>
                      <Badge variant="outline">Pro Coaching</Badge>
                      <Badge variant="outline">Tournament Ready</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Book Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>City Pool Academy</CardTitle>
                  <Badge variant="outline">Applying for Partnership</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Westside Recreation Center</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.6/5 (89 reviews)</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Facilities:</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">8 Pool Tables</Badge>
                      <Badge variant="outline">4 Snooker Tables</Badge>
                      <Badge variant="outline">Pro Shop</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Book Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Player Crowdfunding */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Support Players</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Featured Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">James Wilson</p>
                      <p className="text-sm text-muted-foreground">Junior Championship Journey</p>
                    </div>
                    <Badge variant="outline">Rising Star</Badge>
                  </div>
                  <Progress value={75} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm mb-4">
                    <span>$3,750 raised</span>
                    <span className="text-muted-foreground">of $5,000 goal</span>
                  </div>
                  <Button className="w-full">Support Campaign</Button>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">International Tournament Fund</p>
                    </div>
                    <Badge variant="outline">Pro Player</Badge>
                  </div>
                  <Progress value={40} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm mb-4">
                    <span>$2,000 raised</span>
                    <span className="text-muted-foreground">of $5,000 goal</span>
                  </div>
                  <Button className="w-full">Support Campaign</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Top Supporters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">John Miller</p>
                      <p className="text-sm text-muted-foreground">$1,500 total contributions</p>
                    </div>
                  </div>
                  <Badge>Diamond Supporter</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">Emma Thompson</p>
                      <p className="text-sm text-muted-foreground">$750 total contributions</p>
                    </div>
                  </div>
                  <Badge>Platinum Supporter</Badge>
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