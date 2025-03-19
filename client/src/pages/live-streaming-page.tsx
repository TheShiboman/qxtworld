import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Film, Play, Star } from "lucide-react";

export default function LiveStreamingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Live Streaming</h1>
      
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Pro Player Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Exclusive behind-the-scenes content coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              On-Demand Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Premium lessons and masterclasses coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
