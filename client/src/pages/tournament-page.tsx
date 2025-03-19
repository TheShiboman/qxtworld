import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tournament, insertTournamentSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, Users, Calendar, Loader2, Timer, History, BarChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function TournamentPage() {
  const { user } = useAuth();

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
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
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/tournaments", {
        ...data,
        participants: parseInt(data.participants),
        prize: parseInt(data.prize),
        participationFee: parseInt(data.participationFee)
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

  const ongoing = tournaments.filter(t => t.status === 'in_progress');
  const upcoming = tournaments.filter(t => t.status === 'upcoming');
  const past = tournaments.filter(t => t.status === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Tournaments & Matches</h1>
        {user?.role === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Tournament</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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
                            <Input type="number" {...field} />
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

      <Tabs defaultValue="ongoing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Live Matches
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past Tournaments
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Match Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <div className="space-y-6">
            {ongoing.length > 0 ? (
              ongoing.map(tournament => (
                <Card key={tournament.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <CardTitle>{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && tournament.status === 'upcoming' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/tournaments/${tournament.id}/start`);
                                queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
                                toast({
                                  title: "Tournament Started",
                                  description: "The tournament has been started and matches have been generated.",
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to start tournament",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Start Tournament
                          </Button>
                        )}
                        {user?.role === 'player' && (
                          <Button onClick={() => {}} disabled={tournament.currentParticipants >= parseInt(tournament.participants)} variant={"default"}>
                            Register Now
                          </Button>
                        )}
                      </div>
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
              ))
            ) : (
              <p className="text-center text-muted-foreground">No live matches at the moment.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-6">
            {upcoming.length > 0 ? (
              upcoming.map(tournament => (
                <Card key={tournament.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <CardTitle>{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && tournament.status === 'upcoming' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/tournaments/${tournament.id}/start`);
                                queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
                                toast({
                                  title: "Tournament Started",
                                  description: "The tournament has been started and matches have been generated.",
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to start tournament",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Start Tournament
                          </Button>
                        )}
                        {user?.role === 'player' && (
                          <Button onClick={() => {}} disabled={tournament.currentParticipants >= parseInt(tournament.participants)} variant={"default"}>
                            Register Now
                          </Button>
                        )}
                      </div>
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
              ))
            ) : (
              <p className="text-center text-muted-foreground">No upcoming tournaments.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="space-y-6">
            {past.length > 0 ? (
              past.map(tournament => (
                <Card key={tournament.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <CardTitle>{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && tournament.status === 'upcoming' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/tournaments/${tournament.id}/start`);
                                queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
                                toast({
                                  title: "Tournament Started",
                                  description: "The tournament has been started and matches have been generated.",
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to start tournament",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Start Tournament
                          </Button>
                        )}
                        {user?.role === 'player' && (
                          <Button onClick={() => {}} disabled={tournament.currentParticipants >= parseInt(tournament.participants)} variant={"default"}>
                            Register Now
                          </Button>
                        )}
                      </div>
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
              ))
            ) : (
              <p className="text-center text-muted-foreground">No past tournaments.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Match Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced match analysis and insights coming soon. This feature will provide:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Player performance metrics</li>
                <li>Strategic game analysis</li>
                <li>Historical match statistics</li>
                <li>Predictive insights</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}