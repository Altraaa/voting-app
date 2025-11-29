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
      toast.error("Silakan login untuk melakukan vote");
      return;
    }

    if (votePoints > userPoints) {
      toast.error("Poin tidak mencukupi");
      return;
    }

    if (votePoints < 1) {
      toast.error("Minimal 1 poin untuk vote");
      return;
    }

    try {
      await voteMutations.createMutation.mutateAsync({
        candidateId: selectedCandidate.id,
        pointsUsed: votePoints,
      });

      toast.success(`Berhasil vote dengan ${votePoints} poin!`);
      setIsDialogOpen(false);
      setSelectedCandidate(null);
      setVotePoints(1);
      // Data akan di-refresh otomatis via useEffect
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Gagal melakukan vote. Silakan coba lagi.");
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
      <div className="px-4 lg:px-8 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-24"></div>
          <div className="text-center space-y-4">
            <div className="h-10 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-5 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="px-4 lg:px-8 py-20 text-center">
        <h1 className="text-xl font-bold mb-4">Kategori Tidak Ditemukan</h1>
        <Button asChild>
          <Link href={`/event/${eventId}/category`}>Kembali ke Kategori</Link>
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
    <div className="px-4 lg:px-8 py-20" key={refreshTrigger}>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild size="sm">
          <Link href={`/event/${eventId}/category`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Kategori
          </Link>
        </Button>
      </div>

      {/* Category Header - Layout yang lebih compact */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          {/* Category Image - Ukuran lebih kecil dengan rasio 4:5 */}
          <div className="w-full lg:w-1/3 max-w-xs mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border">
              <Image
                src={categoryData.photo_url || "/placeholder-category.jpg"}
                alt={categoryData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Category Content - Lebih compact */}
          <div className="w-full lg:w-2/3 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground text-sm">
                <Trophy className="w-3 h-3 mr-1" />
                {sortedCandidates.length} Kandidat
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {totalVotes.toLocaleString()} total suara
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-balance mb-4">
              {categoryData.name}
            </h1>

            {categoryData.description && (
              <p className="text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-6">
                {categoryData.description}
              </p>
            )}

            {/* User Points Display - DIPINDAHKAN ke sini */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Poin Voting Anda
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {userPoints}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        poin tersedia
                      </span>
                    </div>
                  </div>
                </div>
                {userPoints === 0 && (
                  <Button asChild size="sm">
                    <Link href="/points">
                      <Star className="mr-2 h-4 w-4" />
                      Beli Poin
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCandidates.map((candidate, index) => {
          const votes = getCandidateVotes(candidate.votes);
          const percentage = parseFloat(getCandidatePercentage(votes));

          return (
            <Card
              key={candidate.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Container dengan rasio 4:5 dan object-contain */}
              <div className="relative aspect-[4/5] bg-muted/30">
                <Image
                  src={candidate.photo_url || "/placeholder-candidate.jpg"}
                  alt={candidate.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-background/90 text-foreground font-bold text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                {index === 0 && votes > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-yellow-500 text-white text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Terdepan
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="p-4">
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                {candidate.description && (
                  <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                    {candidate.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Suara</span>
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  disabled={userPoints === 0 || !isAuthenticated || authLoading}
                  onClick={() => handleVoteClick(candidate)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {!isAuthenticated
                    ? "Login untuk Vote"
                    : userPoints === 0
                    ? "Tidak Ada Poin"
                    : "Vote Sekarang"}
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
            <DialogTitle>Berikan Vote Anda</DialogTitle>
            <DialogDescription>
              Vote untuk <strong>{selectedCandidate?.name}</strong>. Setiap poin
              sama dengan satu suara.
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-4 py-2">
              {/* Candidate Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="relative w-16 h-20 flex-shrink-0">
                  <Image
                    src={
                      selectedCandidate.photo_url ||
                      "/placeholder-candidate.jpg"
                    }
                    alt={selectedCandidate.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">
                    {selectedCandidate.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Saat ini: {selectedCandidate.currentPercentage}%
                  </p>
                </div>
              </div>

              {/* Points Input */}
              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm">
                  Berapa banyak poin yang akan digunakan?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="points"
                    type="number"
                    min={1}
                    max={userPoints}
                    value={votePoints}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVotePoints(userPoints)}
                    disabled={userPoints === 0}
                  >
                    Maks
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tersedia: {userPoints} poin • Menggunakan: {votePoints} poin
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
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Poin yang akan digunakan:</span>
                  <span className="font-bold text-primary text-sm">
                    {votePoints}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Sisa poin:</span>
                  <span className="font-bold text-sm">
                    {userPoints - votePoints}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedCandidate(null);
              }}
            >
              Batal
            </Button>
            <Button
              size="sm"
              disabled={
                voteMutations.createMutation.isPending || votePoints < 1
              }
              onClick={handleVote}
            >
              {voteMutations.createMutation.isPending
                ? "Memproses..."
                : `Konfirmasi Vote (${votePoints} poin)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {sortedCandidates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Belum ada kandidat yang tersedia untuk kategori ini.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/event/${eventId}/category`}>Kembali ke Kategori</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
