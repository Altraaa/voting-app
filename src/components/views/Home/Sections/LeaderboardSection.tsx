"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useCandidates } from "@/config/hooks/CandidateHook/useCandidate";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";
import { useVotes } from "@/config/hooks/VoteHook/useVote";
import { useAuthUser } from "@/config/hooks/useAuthUser";
import { toast } from "sonner";
import { IVotes } from "@/config/models/VotesModel";
import { ICandidate } from "@/config/models/CandidateModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CandidateWithVotes = ICandidate & {
  totalVotes: number;
  percentage: number;
};

type Category = {
  id: string;
  title: string;
  candidates: CandidateWithVotes[];
  totalVotes: number;
};

type EventLeaderboard = {
  id: string;
  title: string;
  trending: boolean;
  categories: Category[];
};

export default function LeaderboardSection() {
  const { queries: eventQueries } = useEvent();
  const { queries: categoryQueries } = useCategories();
  const { queries: candidateQueries } = useCandidates();
  const { mutations: voteMutations } = useVotes();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUser();

  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    photo_url: string | null;
    currentVotes: number;
    currentPercentage: string;
    categoryId: string;
  } | null>(null);
  const [votePoints, setVotePoints] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    data: events = [],
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = eventQueries.useGetAllEvents();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = categoryQueries.useGetAllCategories();
  const {
    data: candidates = [],
    isLoading: candidatesLoading,
    refetch: refetchCandidates,
  } = candidateQueries.useGetAllCandidates();

  const userPoints = user?.points || 0;

  // Refresh data when vote is successful
  useEffect(() => {
    if (voteMutations.createMutation.isSuccess) {
      refetchEvents();
      refetchCategories();
      refetchCandidates();
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [
    voteMutations.createMutation.isSuccess,
    refetchEvents,
    refetchCategories,
    refetchCandidates,
  ]);

  // Calculate candidate votes based on pointsUsed
  const getCandidateVotes = (votes: IVotes[]) => {
    return votes?.reduce((sum, vote) => sum + vote.pointsUsed, 0) || 0;
  };

  // Process data untuk leaderboard
  const getLeaderboardData = (): EventLeaderboard[] => {
    if (eventsLoading || categoriesLoading || candidatesLoading) {
      return [];
    }

    return events
      .slice(0, 3)
      .map((event, index) => {
        // Ambil kategori untuk event ini
        const eventCategories = categories.filter(
          (cat) => cat.eventId === event.id
        );

        // Process setiap kategori dengan kandidatnya
        const processedCategories: Category[] = eventCategories
          .map((category) => {
            // Ambil kandidat untuk kategori ini
            const categoryCandidates = candidates.filter(
              (candidate) => candidate.categoryId === category.id
            );

            // Hitung total votes untuk kategori
            const categoryTotalVotes = categoryCandidates.reduce(
              (sum, candidate) => {
                return sum + getCandidateVotes(candidate.votes);
              },
              0
            );

            // Process setiap kandidat dengan votes dan percentage
            const candidatesWithVotes: CandidateWithVotes[] = categoryCandidates
              .map((candidate) => {
                const votes = getCandidateVotes(candidate.votes);
                const percentage =
                  categoryTotalVotes > 0
                    ? (votes / categoryTotalVotes) * 100
                    : 0;

                return {
                  ...candidate,
                  totalVotes: votes,
                  percentage: percentage,
                };
              })
              .sort((a, b) => b.totalVotes - a.totalVotes); // Urutkan berdasarkan votes tertinggi

            return {
              id: category.id,
              title: category.name,
              candidates: candidatesWithVotes.slice(0, 3), // Ambil top 3 untuk card
              totalVotes: categoryTotalVotes,
              allCandidates: candidatesWithVotes, // Simpan semua kandidat untuk tabel
            };
          })
          .filter((cat) => cat.candidates.length > 0); // Hanya kategori yang punya kandidat

        return {
          id: event.id,
          title: event.name || `Event ${index + 1}`,
          trending: index < 2, // 2 event pertama trending
          categories: processedCategories,
        };
      })
      .filter((event) => event.categories.length > 0); // Hanya event yang punya kategori
  };

  // Voting functions
  const handleVoteClick = (
    candidate: CandidateWithVotes,
    category: Category
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to vote");
      return;
    }

    if (userPoints === 0) {
      toast.error("You don't have any points to vote");
      return;
    }

    setSelectedCandidate({
      id: candidate.id,
      name: candidate.name,
      photo_url: candidate.photo_url,
      currentVotes: candidate.totalVotes,
      currentPercentage: candidate.percentage.toFixed(1),
      categoryId: category.id,
    });
    setVotePoints(1);
    setIsDialogOpen(true);
  };

  const handleVote = async () => {
    if (!selectedCandidate || !isAuthenticated) {
      toast.error("Please login to vote");
      return;
    }

    if (votePoints > userPoints) {
      toast.error("Insufficient points");
      return;
    }

    if (votePoints < 1) {
      toast.error("Minimum 1 point to vote");
      return;
    }

    try {
      await voteMutations.createMutation.mutateAsync({
        candidateId: selectedCandidate.id,
        pointsUsed: votePoints,
      });

      toast.success(`Successfully voted with ${votePoints} points!`);
      setIsDialogOpen(false);
      setSelectedCandidate(null);
      setVotePoints(1);

      // Trigger refresh will happen automatically via useEffect
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= userPoints) {
      setVotePoints(numValue);
    } else {
      setVotePoints(userPoints);
    }
  };

  const leaderboardEvents = getLeaderboardData();

  if (eventsLoading || categoriesLoading || candidatesLoading) {
    return (
      <section className="py-20 px-4 lg:px-20 bg-card/30">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Event <span className="text-primary">Leaderboards</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Loading leaderboards...
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  if (leaderboardEvents.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 px-4 lg:px-20 bg-card/30">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Event <span className="text-primary">Leaderboards</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse live standings by event and category. Select an event, then a
            category to see the top candidates and their progress.
          </p>
        </div>

        <Tabs
          defaultValue={leaderboardEvents[0]?.id}
          className="w-full"
          key={refreshTrigger}
        >
          <div className="flex items-center justify-between gap-4 mb-8">
            <TabsList className="flex flex-wrap">
              {leaderboardEvents.map((ev, idx) => (
                <TabsTrigger key={ev.id} value={ev.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span>{ev.title}</span>
                    {ev.trending && (
                      <Badge
                        variant="secondary"
                        className="px-1 py-0 text-[10px]"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {idx === 0 && (
                      <Badge className="px-1 py-0 text-[10px]">
                        <Trophy className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/event">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {leaderboardEvents.map((ev) => {
            return (
              <TabsContent key={ev.id} value={ev.id}>
                {/* Category chooser */}
                <div className="mb-6">
                  <Tabs defaultValue={ev.categories[0]?.id} className="w-full">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-full overflow-x-auto">
                        <TabsList className="inline-flex min-w-max">
                          {ev.categories.map((cat) => (
                            <TabsTrigger
                              key={cat.id}
                              value={cat.id}
                              className="text-sm"
                            >
                              {cat.title}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      <Button
                        variant="outline"
                        className="bg-transparent"
                        asChild
                      >
                        <Link href={`/event/${ev.id}/category`}>
                          View All Categories
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {ev.categories.map((cat) => {
                      const allCandidates =
                        (cat as any).allCandidates || cat.candidates;
                      const topCandidates = cat.candidates;
                      const remainingCandidates = allCandidates.slice(3);

                      return (
                        <TabsContent key={cat.id} value={cat.id}>
                          {/* User Points Display */}
                          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <Coins className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Your Voting Points
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-primary">
                                      {userPoints}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      points available
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {userPoints === 0 && (
                                <Button asChild size="sm">
                                  <Link href="/points">
                                    <Star className="mr-2 h-4 w-4" />
                                    Buy Points
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Top 3 Candidates in Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {topCandidates.map((candidate, index) => (
                              <Card
                                key={candidate.id}
                                className="relative overflow-hidden hover:shadow-lg transition-shadow"
                              >
                                {index === 0 && candidate.percentage > 0 && (
                                  <div className="absolute top-4 right-4">
                                    <Badge className="bg-primary text-primary-foreground">
                                      <Trophy className="w-3 h-3 mr-1" />
                                      #1
                                    </Badge>
                                  </div>
                                )}
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg text-balance leading-tight">
                                    {candidate.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {cat.totalVotes.toLocaleString()} total
                                      votes
                                    </div>
                                    <div>{index + 1} place</div>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">Share</span>
                                      <span className="text-sm text-muted-foreground">
                                        {candidate.percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                    <Progress
                                      value={candidate.percentage}
                                      className="h-2"
                                    />
                                  </div>

                                  <Button
                                    className="w-full"
                                    disabled={
                                      userPoints === 0 ||
                                      !isAuthenticated ||
                                      authLoading
                                    }
                                    onClick={() =>
                                      handleVoteClick(candidate, cat)
                                    }
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    {!isAuthenticated
                                      ? "Login to Vote"
                                      : userPoints === 0
                                      ? "No Points"
                                      : "Vote Now"}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* Remaining Candidates in Table */}
                          {remainingCandidates.length > 0 && (
                            <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-4">
                                Other Candidates
                              </h3>
                              <div className="border rounded-lg">
                                {remainingCandidates.map((candidate: any, index: number) => (
                                  <div
                                    key={candidate.id}
                                    className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-4">
                                      <span className="font-medium text-muted-foreground w-6">
                                        #{index + 4}
                                      </span>
                                      <span className="font-medium">
                                        {candidate.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-32">
                                        <Progress
                                          value={candidate.percentage}
                                          className="h-2"
                                        />
                                      </div>
                                      <span className="text-sm text-muted-foreground w-12 text-right">
                                        {candidate.percentage.toFixed(1)}%
                                      </span>
                                      <Button
                                        size="sm"
                                        disabled={
                                          userPoints === 0 ||
                                          !isAuthenticated ||
                                          authLoading
                                        }
                                        onClick={() =>
                                          handleVoteClick(candidate, cat)
                                        }
                                      >
                                        <Star className="mr-2 h-3 w-3" />
                                        Vote
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-center">
                            <Button variant="outline" size="lg" asChild>
                              <Link href={`/event/${ev.id}/category/${cat.id}`}>
                                View Category Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      {/* Voting Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cast Your Vote</DialogTitle>
            <DialogDescription>
              Vote for <strong>{selectedCandidate?.name}</strong>. Each point
              equals one vote.
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6 py-4">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedCandidate.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current: {selectedCandidate.currentPercentage}%
                  </p>
                </div>
              </div>

              {/* Points Input */}
              <div className="space-y-2">
                <Label htmlFor="points">How many points to use?</Label>
                <div className="flex gap-2">
                  <Input
                    id="points"
                    type="number"
                    min={1}
                    max={userPoints}
                    value={votePoints}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setVotePoints(userPoints)}
                    disabled={userPoints === 0}
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {userPoints} points • Using: {votePoints} points
                </p>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 20].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setVotePoints(Math.min(amount, userPoints))}
                    disabled={amount > userPoints}
                  >
                    {amount}
                  </Button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Points to use:</span>
                  <span className="font-bold text-primary">{votePoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remaining points:</span>
                  <span className="font-bold">{userPoints - votePoints}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedCandidate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={
                voteMutations.createMutation.isPending || votePoints < 1
              }
              onClick={handleVote}
            >
              {voteMutations.createMutation.isPending
                ? "Voting..."
                : `Confirm Vote (${votePoints} points)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
