import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tournament, insertTournamentSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Bracket from "@/components/tournaments/bracket";
import { Trophy, Users, Calendar, Loader2 } from "lucide-react";
import Predictions from "@/components/tournaments/predictions";
import Leaderboard from "@/components/tournaments/leaderboard";
import InsightsDashboard from "@/components/tournaments/insights-dashboard";
import { toast } from "@/hooks/use-toast";
import { TournamentRegistration } from "@shared/schema";

export default function TournamentPage() {
  const { user } = useAuth();

  const { data: tournaments = [], isLoading, error } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: userRegistrations = [] } = useQuery<TournamentRegistration[]>({
    queryKey: ["/api/user/tournaments"],
    enabled: !!user
  });

  const registerMutation = useMutation({
    mutationFn: async (tournamentId: number) => {
      const response = await apiRequest("POST", `/api/tournaments/${tournamentId}/register`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Registration Successful",
        description: "You have been registered for the tournament.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertTournamentSchema),
    defaultValues: {
      name: "",
      type: "snooker",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      format: "single elimination",
      participants: "8",
      prize: "1000",
      participationFee: "0",
      description: "",
      status: "upcoming",
      currentParticipants: 0,
      bracket: []
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/tournaments", {
        ...data,
        participants: String(data.participants),
        prize: String(data.prize),
        participationFee: String(data.participationFee)
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament created successfully.",
      });
    } catch (error: any) {
      console.error("Failed to create tournament:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRegistrationStatus = (tournament: Tournament) => {
    const isRegistered = userRegistrations.some(
      reg => reg.tournamentId === tournament.id
    );
    const isFull = tournament.currentParticipants >= tournament.participants;
    const isDeadlinePassed = new Date(tournament.registrationDeadline) < new Date();

    if (isRegistered) return { status: "registered", label: "Registered" };
    if (isFull) return { status: "full", label: "Tournament Full" };
    if (isDeadlinePassed) return { status: "closed", label: "Registration Closed" };
    return { status: "open", label: "Register Now" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Failed to load tournaments. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Tournaments</h1>
        {user?.role === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Tournament</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full p-2 border rounded-md bg-background">
                              <option value="snooker">Snooker</option>
                              <option value="pool">Pool</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registrationDeadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Participants</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prize Pool ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="participationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Participation Fee ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournament Format</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border rounded-md bg-background">
                            <option value="single elimination">Single Elimination</option>
                            <option value="double elimination">Double Elimination</option>
                            <option value="round robin">Round Robin</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Create Tournament</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-8">
        {tournaments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tournaments available
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <CardTitle>{tournament.name}</CardTitle>
                    </div>
                    {user?.role === 'player' && (
                      <div>
                        {(() => {
                          const regStatus = getRegistrationStatus(tournament);
                          return (
                            <Button
                              onClick={() => registerMutation.mutate(tournament.id)}
                              disabled={regStatus.status !== 'open' || registerMutation.isPending}
                              variant={regStatus.status === 'registered' ? "outline" : "default"}
                              className={`min-w-[140px] ${
                                regStatus.status === 'registered' ? 'bg-green-100' : ''
                              }`}
                            >
                              {registerMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                regStatus.label
                              )}
                            </Button>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tournament.description}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(tournament.startDate).toLocaleDateString()} -
                          {new Date(tournament.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {tournament.currentParticipants} / {tournament.participants} participants
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold">
                          Prize Pool: ${tournament.prize.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entry Fee: ${tournament.participationFee.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Format</p>
                        <p className="text-sm text-muted-foreground">{tournament.format}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Registration Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tournament.registrationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground capitalize">{tournament.status}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Leaderboard tournament={tournament} />

              {tournament.status === "in_progress" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Bracket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Bracket tournament={tournament} />
                  </CardContent>
                </Card>
              )}

              <InsightsDashboard tournament={tournament} />

              <Card>
                <CardHeader>
                  <CardTitle>Make Your Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <Predictions tournament={tournament} />
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}