import { useQuery } from "@tanstack/react-query";
import { Tournament, User, Prediction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Trophy, Medal, TrendingUp } from "lucide-react";

interface InsightsDashboardProps {
  tournament: Tournament;
}

export default function InsightsDashboard({ tournament }: InsightsDashboardProps) {
  const { data: predictions = [] } = useQuery<Prediction[]>({
    queryKey: [`/api/tournaments/${tournament.id}/predictions`],
  });

  const { data: leaderboard = [] } = useQuery<Array<{ user: User; points: number }>>({
    queryKey: [`/api/tournaments/${tournament.id}/leaderboard`],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate prediction distribution
  const predictionDistribution = users.map((user: User) => ({
    name: user.fullName,
    value: predictions.filter((p: Prediction) => p.predictedWinnerId === user.id).length
  })).filter(item => item.value > 0);

  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate points over time
  const pointsOverTime = leaderboard.map((entry) => ({
    name: entry.user.fullName,
    points: entry.points
  }));

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prediction Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Prediction Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={predictionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {predictionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Points Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Points Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={pointsOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="points" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Predictors Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            Top Predictors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.user.id}
                className="flex items-center justify-between p-4 bg-accent rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{index + 1}</span>
                  <div>
                    <p className="font-medium">{entry.user.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      Success Rate: {((entry.points / (predictions.filter(
                        (p: Prediction) => p.userId === entry.user.id
                      ).length || 1)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold">{entry.points} points</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}