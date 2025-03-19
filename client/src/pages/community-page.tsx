import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Video, Newspaper } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Community & Social Hub</h1>
      
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
              <Users className="h-5 w-5 text-primary" />
              Player Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Set up custom matches and friendly games coming soon.
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
