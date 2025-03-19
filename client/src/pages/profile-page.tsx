import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { Award, BarChart, ChevronUp, Clock, Medal, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link2, Globe, Shield, FileText, Headphones, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { user } = useAuth();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest("PATCH", `/api/users/${user!.id}`, { role });
      return response.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Role Updated",
        description: "Your role has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-6">
        {/* User Bio Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Player Profile</CardTitle>
              <Badge variant="outline" className="bg-primary/10">
                <Shield className="h-4 w-4 mr-1" />
                Verified Player
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    placeholder="Tell us about your cue sports journey..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Social Links</label>
                  <div className="grid sm:grid-cols-2 gap-4 mt-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Input placeholder="Website URL" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      <Input placeholder="Social media link" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Career Highlights</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">127</p>
                    <p className="text-sm text-muted-foreground">Highest Break</p>
                  </div>
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-sm text-muted-foreground">Titles Won</p>
                  </div>
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Years Pro</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tournament Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">QXT World Championship 2024</p>
                    <p className="text-sm text-muted-foreground">Quarter-Finals</p>
                  </div>
                  <Badge>Major Event</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Highest Break: 98</p>
                  <p>• Win Rate: 75%</p>
                  <p>• Notable Wins: 2 seeded players</p>
                </div>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Regional Masters 2024</p>
                    <p className="text-sm text-muted-foreground">Winner</p>
                  </div>
                  <Badge>Regional</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Highest Break: 87</p>
                  <p>• Win Rate: 85%</p>
                  <p>• Clean sweep in finals (4-0)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsorship Application */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Sponsorship Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-accent rounded-lg">
                <h3 className="font-medium mb-4">Application Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Profile Completion</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Requirements Met:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Verified Player Status</li>
                    <li>Tournament Experience</li>
                    <li>Social Media Presence</li>
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Button className="w-full">Apply for Sponsorship</Button>
                <Button variant="outline" className="w-full">View Guidelines</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Support Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Live Chat Support</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect with our support team for immediate assistance
                  </p>
                  <Button className="w-full mt-4">Start Chat</Button>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <FileText className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Help Center</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Browse FAQs and documentation
                  </p>
                  <Button variant="outline" className="w-full mt-4">View Articles</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Personal Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recent Achievements */}
              <div className="space-y-4">
                <h3 className="font-medium">Recent Achievements</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                    <Medal className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">Century Break</p>
                      <p className="text-sm text-muted-foreground">Achieved 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                    <Award className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Tournament Winner</p>
                      <p className="text-sm text-muted-foreground">Achieved 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="space-y-4">
                <h3 className="font-medium">Achievement Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Master Break Builder</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Tournament Specialist</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match History & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Match History & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-accent rounded-lg text-center">
                  <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">76%</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
                <div className="p-4 bg-accent rounded-lg text-center">
                  <ChevronUp className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">112</p>
                  <p className="text-sm text-muted-foreground">Highest Break</p>
                </div>
                <div className="p-4 bg-accent rounded-lg text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Matches Played</p>
                </div>
              </div>

              {/* Recent Matches */}
              <div>
                <h3 className="font-medium mb-4">Recent Matches</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">vs. John Smith</p>
                      <p className="text-sm text-muted-foreground">Won 3-1</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Victory</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">vs. Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Lost 2-3</p>
                    </div>
                    <Badge className="bg-red-500/10 text-red-500">Defeat</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">vs. Mike Johnson</p>
                      <p className="text-sm text-muted-foreground">Won 4-2</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Victory</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As an administrator, you have access to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Creating and managing tournaments</li>
                  <li>Managing user roles and permissions</li>
                  <li>Approving tournament registrations</li>
                  <li>System-wide settings and configurations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}