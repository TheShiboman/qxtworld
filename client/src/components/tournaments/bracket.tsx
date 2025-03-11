import { Match, Tournament } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface BracketProps {
  tournament: Tournament;
}

interface MatchWithPlayers extends Match {
  player1?: { id: number; fullName: string } | null;
  player2?: { id: number; fullName: string } | null;
}

interface UpdateMatchForm {
  score1: number;
  score2: number;
}

export default function Bracket({ tournament }: BracketProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: matches = [], isLoading } = useQuery<MatchWithPlayers[]>({
    queryKey: [`/api/tournaments/${tournament.id}/matches`],
    refetchInterval: 5000, // Poll for updates every 5 seconds
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, data }: { matchId: number; data: UpdateMatchForm }) => {
      await apiRequest("PATCH", `/api/matches/${matchId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournament.id}/matches`] });
      toast({
        title: "Match updated",
        description: "The match scores have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update match",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group matches by round
  const matchesByRound = matches.reduce((acc: MatchWithPlayers[][], match) => {
    const roundIndex = match.round - 1;
    if (!acc[roundIndex]) {
      acc[roundIndex] = [];
    }
    acc[roundIndex].push(match);
    return acc;
  }, []);

  const EditMatchDialog = ({ match }: { match: MatchWithPlayers }) => {
    const form = useForm<UpdateMatchForm>({
      defaultValues: {
        score1: match.score1,
        score2: match.score2,
      },
    });

    const onSubmit = (data: UpdateMatchForm) => {
      updateMatchMutation.mutate({ matchId: match.id, data });
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Match Score</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="score1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{match.player1?.fullName || 'Player 1'}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="score2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{match.player2?.fullName || 'Player 2'}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={updateMatchMutation.isPending}
              >
                {updateMatchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Update Score'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-[800px]">
        {matchesByRound.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className="flex flex-col gap-8 relative"
            style={{
              marginTop: `${roundIndex * 32}px`
            }}
          >
            <div className="mb-4 text-sm font-medium text-muted-foreground">
              Round {roundIndex + 1}
            </div>
            {round.map((match, matchIndex) => (
              <div key={match.id} className="relative">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`w-64 relative ${
                        match.status === 'completed' ? 'border-primary/50' : ''
                      }`}
                    >
                      {isAdmin && match.status !== 'completed' && (
                        <EditMatchDialog match={match} />
                      )}
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <motion.div
                            className={`p-2 rounded transition-colors ${
                              match.winner === match.player1Id ? 'bg-primary/10' : ''
                            }`}
                            animate={{
                              backgroundColor: match.winner === match.player1Id ? 'rgba(var(--primary), 0.1)' : 'transparent'
                            }}
                          >
                            <p className="font-medium">
                              {match.player1?.fullName || 'TBD'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.score1}
                            </p>
                          </motion.div>
                          <motion.div
                            className={`p-2 rounded transition-colors ${
                              match.winner === match.player2Id ? 'bg-primary/10' : ''
                            }`}
                            animate={{
                              backgroundColor: match.winner === match.player2Id ? 'rgba(var(--primary), 0.1)' : 'transparent'
                            }}
                          >
                            <p className="font-medium">
                              {match.player2?.fullName || 'TBD'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.score2}
                            </p>
                          </motion.div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {match.status === 'scheduled' && match.startTime && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                Scheduled: {new Date(match.startTime).toLocaleString()}
                              </motion.span>
                            )}
                            {match.status === 'in_progress' && (
                              <motion.span
                                className="text-primary"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                In Progress
                              </motion.span>
                            )}
                            {match.status === 'completed' && (
                              <motion.span
                                className="text-green-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                Completed
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Draw connecting lines to next match */}
                    {match.nextMatchNumber > 0 && (
                      <motion.svg
                        className="absolute top-1/2 right-0 w-8 h-px"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="32"
                          y2="0"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="text-muted-foreground"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}