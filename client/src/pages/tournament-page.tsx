import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tournament, cueSportsDisciplines, matchTypes, tournamentFormats, disciplineTypes } from "@shared/schema";
import { Trophy, Users, Calendar, Loader2, Timer, History, BarChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import React from 'react';

export default function TournamentPage() {
  const { user } = useAuth();
  const [tournamentDialogOpen, setTournamentDialogOpen] = React.useState(false);

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: venues = [] } = useQuery({
    queryKey: ["/api/venues"],
  });

  const form = useForm({
    defaultValues: {
      name: "",
      discipline: "Snooker",
      disciplineType: "Full Reds",
      matchType: "Single",
      format: "Single Elimination",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      participants: "32",
      prize: "1000",
      participationFee: "20",
      description: "",
      venueId: "",
    }
  });

  const selectedDiscipline = form.watch("discipline") as keyof typeof disciplineTypes;

  React.useEffect(() => {
    // Update discipline type when discipline changes
    if (disciplineTypes[selectedDiscipline]) {
      form.setValue("disciplineType", disciplineTypes[selectedDiscipline][0]);
    }
  }, [selectedDiscipline, form]);

  const onSubmit = async (values: any) => {
    try {
      const formattedData = {
        ...values,
        organizerId: user!.id,
        status: "upcoming",
        currentParticipants: 0,
      };

      await apiRequest("POST", "/api/tournaments", formattedData);
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament created successfully.",
      });
      setTournamentDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive"
      });
    }
  };

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
        {(user?.role === "admin" || user?.role === "referee") && (
          <Dialog open={tournamentDialogOpen} onOpenChange={setTournamentDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Tournament</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label>Tournament Name</label>
                  <Input {...form.register("name")} />
                </div>

                <div>
                  <label>Venue</label>
                  <Select onValueChange={(value) => form.setValue("venueId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue: any) => (
                        <SelectItem key={venue.id} value={venue.id.toString()}>
                          {venue.name} - {venue.city}, {venue.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Discipline</label>
                  <Select onValueChange={(value) => form.setValue("discipline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      {cueSportsDisciplines.map((discipline) => (
                        <SelectItem key={discipline} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Discipline Type</label>
                  <Select onValueChange={(value) => form.setValue("disciplineType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discipline type" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplineTypes[selectedDiscipline]?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Match Type</label>
                  <Select onValueChange={(value) => form.setValue("matchType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select match type" />
                    </SelectTrigger>
                    <SelectContent>
                      {matchTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Tournament Format</label>
                  <Select onValueChange={(value) => form.setValue("format", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournamentFormats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label>Start Date</label>
                  <Input type="date" {...form.register("startDate")} />
                </div>

                <div>
                  <label>End Date</label>
                  <Input type="date" {...form.register("endDate")} />
                </div>

                <div>
                  <label>Registration Deadline</label>
                  <Input type="date" {...form.register("registrationDeadline")} />
                </div>

                <div>
                  <label>Number of Participants</label>
                  <Input type="number" {...form.register("participants")} />
                </div>

                <div>
                  <label>Prize Pool ($)</label>
                  <Input type="number" {...form.register("prize")} />
                </div>

                <div>
                  <label>Entry Fee ($)</label>
                  <Input type="number" {...form.register("participationFee")} />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    {...form.register("description")}
                    className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Tournament
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ongoing">
            <Timer className="h-4 w-4 mr-2" />
            Live Matches
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past">
            <History className="h-4 w-4 mr-2" />
            Past Tournaments
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart className="h-4 w-4 mr-2" />
            Match Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <div className="space-y-6">
            {tournaments.filter(t => t.status === 'in_progress').map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-6">
            {tournaments.filter(t => t.status === 'upcoming').map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="space-y-6">
            {tournaments.filter(t => t.status === 'completed').map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">Match analysis feature coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>{tournament.name}</CardTitle>
          </div>
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
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Format</p>
              <p className="text-sm text-muted-foreground">{tournament.format}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prize Pool</p>
              <p className="text-lg font-bold">${tournament.prize.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">{tournament.status}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}