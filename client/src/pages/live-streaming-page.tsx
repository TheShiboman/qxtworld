import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Film, Play, Star, BookOpen, Upload, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LiveStreamingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Live Streaming</h1>

      <div className="space-y-8">
        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Live Tournament Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Official QXT World tournament streams coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                Match Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI-generated highlight clips coming soon.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Player Insights & Commentary */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Player Insights & Commentary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">QXT Championship Final</p>
                      <Badge>Pro Analysis</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Break-building patterns and tactical decisions explained by professional analysts
                    </p>
                    <Button variant="outline" className="w-full">Watch Analysis</Button>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Masters Semi-Final</p>
                      <Badge>Featured</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Key moments and strategic insights from the match
                    </p>
                    <Button variant="outline" className="w-full">Watch Analysis</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Expert Commentary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="font-medium">Pro Player Commentary</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frame-by-frame analysis from champion players
                    </p>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="font-medium">Live Commentary</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-time insights during tournament matches
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Uploads */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Community Uploads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Share Your Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Upload and share your match recordings with the community
                  </p>
                  <Button className="w-full">Upload Match</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Club Championship</CardTitle>
                <Badge className="w-fit">Featured Upload</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-accent rounded-lg"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uploaded by Mark S.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">4.8/5 Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Watch Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Local Tournament</CardTitle>
                <Badge className="w-fit">Recent Upload</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-accent rounded-lg"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uploaded by Chris L.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">4.6/5 Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Watch Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}