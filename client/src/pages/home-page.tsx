import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trophy, Monitor, Users, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to QXT World</h1>
        <p className="text-muted-foreground">
          Your digital portal for cue sports management and competition
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/tournaments">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tournaments?.length || 0}</p>
              <p className="text-muted-foreground">Active tournaments</p>
            </CardContent>
          </Card>
        </Link>

        {user.role === 'referee' && (
          <Link href="/live-scoring">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader>
                <Monitor className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage match scores</p>
              </CardContent>
            </Card>
          </Link>
        )}

        <Link href="/players">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View rankings and stats</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shop">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Equipment Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products?.length || 0}</p>
              <p className="text-muted-foreground">Available products</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {tournaments && tournaments.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 3).map((tournament: any) => (
              <Card key={tournament.id}>
                <CardHeader>
                  <CardTitle>{tournament.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{tournament.type}</p>
                  <p className="text-sm">
                    Starts: {new Date(tournament.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Prize Pool: ${tournament.prize.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
