import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import TournamentPage from "@/pages/tournament-page";
import LiveScoring from "@/pages/live-scoring";
import ShopPage from "@/pages/shop-page";
import PlayersPage from "@/pages/players-page";
import ProfilePage from "@/pages/profile-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/tournaments/:id/live-scoring" component={LiveScoring} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/tournaments" component={TournamentPage} />
      <ProtectedRoute path="/shop" component={ShopPage} />
      <ProtectedRoute path="/players" component={PlayersPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto py-4">
            <Router />
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}