import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Calendar, Bell, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Profile Overview */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.fullName}</h1>
        <p className="text-muted-foreground">Your personal QXT World dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent matches</p>
          </CardContent>
        </Card>

        {/* Upcoming Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming tournaments</p>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Stats 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Win Rate</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Highest Break</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tournaments Played</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No new notifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
