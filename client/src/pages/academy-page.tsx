import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Book, Video, Award, Users, Star, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AcademyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">QXT World Academy</h1>

      {/* Courses & Certifications Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Courses & Certifications</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Professional Referee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">6 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">International certification</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Become a certified professional referee with international recognition.
                </p>
                <Button className="w-full">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Advanced Coaching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">12 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Level 3 Certification</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Master advanced coaching techniques and player development.
                </p>
                <Button className="w-full">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Training Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">4 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Digital Certificate</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn to assess and develop training programs for players.
                </p>
                <Button className="w-full">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coaching Marketplace */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Coaching Marketplace</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured Coaches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Featured Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">James Wilson</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">4.9/5</span>
                      </div>
                    </div>
                    <Badge>Pro Coach</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Former national champion with 15+ years coaching experience
                  </p>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Sarah Chen</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">4.8/5</span>
                      </div>
                    </div>
                    <Badge>Elite Coach</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Specialized in youth development and tournament preparation
                  </p>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking & Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Coaching Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <h3 className="font-medium mb-2">One-on-One Training</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Personalized training sessions</li>
                    <li>Video analysis and feedback</li>
                    <li>Custom practice routines</li>
                  </ul>
                  <Button className="w-full">Book Session</Button>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <h3 className="font-medium mb-2">Group Training</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Small group sessions (3-4 players)</li>
                    <li>Tournament preparation</li>
                    <li>Competitive drills and exercises</li>
                  </ul>
                  <Button className="w-full">Join Group</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Academy Features */}
      <div className="grid md:grid-cols-2 gap-6">
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