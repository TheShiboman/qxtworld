import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Book, Video, Award } from "lucide-react";

export default function AcademyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">QXT World Academy</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Courses & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Professional coaching certification programs coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Grassroots Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              School and youth programs coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Virtual Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Live coaching sessions with professionals coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Q School & Q Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Professional tour qualification pathway coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
