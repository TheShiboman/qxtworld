import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Book, Video, Trophy } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Training & Development</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              AI-Generated Training Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Personalized training plans based on your match performance coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Skill-Based Drills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cue control, positional play, and break-building challenges coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Coaching Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect with certified coaches for online/offline training coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Video Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pro player tutorials, match analysis, and technique guides coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
