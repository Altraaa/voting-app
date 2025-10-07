"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, ArrowLeft, Star, Trophy, Coins } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";
import { useVotes } from "@/config/hooks/VoteHook/useVote";
import { toast } from "sonner";
import { useAuthUser } from "@/config/hooks/useAuthUser";
import { IVotes } from "@/config/models/VotesModel";
import { ICandidate } from "@/config/models/CandidateModel";
import { useCandidates } from "@/config/hooks/CandidateHook/useCandidate";

export default function DetailCategoryView() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const eventId = params.id as string;

  const { queries: categoryQueries } = useCategories();
  const { mutations: voteMutations } = useVotes();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUser();
  const { queries: candidateQueries } = useCandidates();

  const {
    data: categoryData,
    isLoading: categoryLoading,
    refetch: refetchCategory,
  } = categoryQueries.useGetCategoryById(categoryId);

  // Fetch candidates by category ID
  const {
    data: candidatesData,
    isLoading: candidatesLoading,
    refetch: refetchCandidates,
  } = candidateQueries.useGetCandidatesByCategoryId(categoryId);

  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    photo_url: string | null;
    currentVotes: number;
    currentPercentage: string;
  } | null>(null);
  const [votePoints, setVotePoints] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userPoints = user?.points || 0;

  // Refetch data after successful vote
  useEffect(() => {
    if (voteMutations.createMutation.isSuccess) {
      refetchCategory();
      refetchCandidates();
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [
    voteMutations.createMutation.isSuccess,
    refetchCategory,
    refetchCandidates,
  ]);

  const getTotalVotes = () => {
    if (!candidatesData) return 0;
    return candidatesData.reduce((sum, candidate) => {
      const candidateVotes = getCandidateVotes(candidate.votes);
      return sum + candidateVotes;
    }, 0);
  };

  const getCandidateVotes = (votes: IVotes[]) => {
    return votes?.reduce((sum, vote) => sum + vote.pointsUsed, 0) || 0;
  };

  const getCandidatePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? ((votes / total) * 100).toFixed(1) : "0.0";
  };

  const handleVoteClick = (candidate: ICandidate) => {
    const votes = getCandidateVotes(candidate.votes);
    const percentage = getCandidatePercentage(votes);

    setSelectedCandidate({
      id: candidate.id,
      name: candidate.name,
      photo_url: candidate.photo_url,
      currentVotes: votes,
      currentPercentage: percentage,
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
      // Data akan di-refresh otomatis via useEffect
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

  // Combined loading state
  const isLoading = categoryLoading || candidatesLoading;

  if (isLoading) {
    return (
      <div className="px-4 lg:px-20 py-28">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-muted rounded w-32"></div>
          <div className="text-center space-y-4">
            <div className="h-12 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="px-4 lg:px-20 py-28 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Button asChild>
          <Link href={`/event/${eventId}/category`}>Back to Categories</Link>
        </Button>
      </div>
    );
  }

  const totalVotes = getTotalVotes();
  const sortedCandidates = [...(candidatesData || [])].sort((a, b) => {
    const aVotes = getCandidateVotes(a.votes);
    const bVotes = getCandidateVotes(b.votes);
    return bVotes - aVotes;
  });

  return (
    <div className="px-4 lg:px-20 py-28" key={refreshTrigger}>
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/event/${eventId}/category`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>

      {/* Category Header with Image */}
      <Card className="mb-12 overflow-hidden">
        <div className="relative h-80 md:h-96">
          <Image
            src={categoryData.photo_url || "/placeholder-category.jpg"}
            alt={categoryData.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Category Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex justify-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                <Trophy className="w-3 h-3 mr-1" />
                {sortedCandidates.length} Candidates
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-balance text-center mb-4">
              {categoryData.name}
            </h1>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {totalVotes.toLocaleString()} total votes
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* User Points Display */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Your Voting Points
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {userPoints}
                </span>
                <span className="text-sm text-muted-foreground">
                  points available
                </span>
              </div>
            </div>
          </div>
          {userPoints === 0 && (
            <Button asChild>
              <Link href="/points">
                <Star className="mr-2 h-4 w-4" />
                Buy Points
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCandidates.map((candidate, index) => {
          const votes = getCandidateVotes(candidate.votes);
          const percentage = parseFloat(getCandidatePercentage(votes));

          return (
            <Card
              key={candidate.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={candidate.photo_url || "/placeholder-candidate.jpg"}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-background/90 text-foreground font-bold">
                    #{index + 1}
                  </Badge>
                </div>
                {index === 0 && votes > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      Leading
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{candidate.name}</CardTitle>
                {candidate.description && (
                  <p className="text-sm text-muted-foreground text-pretty">
                    {candidate.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Votes</span>
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                <Button
                  className="w-full"
                  disabled={userPoints === 0 || !isAuthenticated || authLoading}
                  onClick={() => handleVoteClick(candidate)}
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
          );
        })}
      </div>

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
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={
                      selectedCandidate.photo_url ||
                      "/placeholder-candidate.jpg"
                    }
                    alt={selectedCandidate.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
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

      {/* Empty State */}
      {sortedCandidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No candidates available yet for this category.
          </p>
          <Button asChild variant="outline">
            <Link href={`/event/${eventId}/category`}>Back to Categories</Link>
          </Button>
        </div>
      )}
    </div>
  );
}