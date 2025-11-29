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
  Crown,
  Medal,
  Award,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  const { user, isAuthenticated } = useAuthUser();

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
          title: event.name || `Acara ${index + 1}`,
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
      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    if (userPoints === 0) {
      // Redirect to points page
      window.location.href = "/points";
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
      toast.error("Silakan login untuk memberikan suara");
      return;
    }

    if (votePoints > userPoints) {
      toast.error("Poin tidak mencukupi");
      return;
    }

    if (votePoints < 1) {
      toast.error("Minimal 1 poin untuk memberikan suara");
      return;
    }

    try {
      await voteMutations.createMutation.mutateAsync({
        candidateId: selectedCandidate.id,
        pointsUsed: votePoints,
      });

      toast.success(`Berhasil memberikan suara dengan ${votePoints} poin!`);
      setIsDialogOpen(false);
      setSelectedCandidate(null);
      setVotePoints(1);

      // Trigger refresh will happen automatically via useEffect
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Gagal memberikan suara. Silakan coba lagi.");
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

  const getVoteButtonText = () => {
    if (!isAuthenticated) {
      return "Login untuk Vote";
    }
    if (userPoints === 0) {
      return "Beli Poin untuk Vote";
    }
    return "Vote Sekarang";
  };

  const leaderboardEvents = getLeaderboardData();

  if (eventsLoading || categoriesLoading || candidatesLoading) {
    return (
      <section className="py-20 px-4 lg:px-20 bg-card/30">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            <span className="text-primary">Papan Peringkat</span> Acara
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Memuat papan peringkat...
          </p>
        </div>
        <div className="space-y-6">
          {/* Loading Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-md" />
              ))}
            </div>
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
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
            <span className="text-primary">Papan Peringkat</span> Acara
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Lihat peringkat langsung berdasarkan acara dan kategori. Pilih
            acara, lalu kategori untuk melihat kandidat teratas dan
            perkembangannya.
          </p>
        </div>

        <Tabs
          defaultValue={leaderboardEvents[0]?.id}
          className="w-full"
          key={refreshTrigger}
        >
          <div className="flex flex-col justify-center w-full md:flex-row items-center md:justify-between gap-2 md:gap-4 mb-5 md:mb-8">
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
                        Unggulan
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/event">
                Lihat Semua Acara
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
                    <div className="flex items-center justify-between gap-2 md:gap-4 mb-6">
                      <div className="w-full md:overflow-x-auto">
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
                          Lihat Semua Kategori
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {ev.categories.map((cat) => {
                      const allCandidates =
                        (
                          cat as Category & {
                            allCandidates?: CandidateWithVotes[];
                          }
                        ).allCandidates || cat.candidates;
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
                                    Poin Voting Anda
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-primary">
                                      {userPoints}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
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

                          {/* Top 3 Candidates in Enhanced Cards */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {topCandidates.map((candidate, index) => {
                              const rankIcons = [
                                <Crown
                                  key="crown-icon"
                                  className="w-6 h-6 text-yellow-500"
                                />,
                                <Award
                                  key="award-icon"
                                  className="w-6 h-6 text-gray-400"
                                />,
                                <Medal
                                  key="medal-icon"
                                  className="w-6 h-6 text-amber-600"
                                />,
                              ];

                              const rankColors = [
                                "from-yellow-400/20 to-yellow-600/10 border-yellow-300/30",
                                "from-gray-400/20 to-gray-600/10 border-gray-300/30",
                                "from-amber-600/20 to-amber-800/10 border-amber-500/30",
                              ];

                              const rankBadges = [
                                "bg-yellow-500 text-yellow-950",
                                "bg-gray-400 text-gray-950",
                                "bg-amber-600 text-amber-50",
                              ];

                              return (
                                <Card
                                  key={candidate.id}
                                  className={cn(
                                    "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl",
                                    index === 0
                                      ? "lg:scale-105 lg:-translate-y-2"
                                      : "",
                                    `bg-gradient-to-br ${rankColors[index]}`
                                  )}
                                >
                                  {/* Rank Badge */}
                                  <div className="absolute top-4 left-4 z-10">
                                    <Badge
                                      className={cn(
                                        "px-3 py-1 font-bold text-sm",
                                        rankBadges[index]
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        {rankIcons[index]}#{index + 1}
                                      </div>
                                    </Badge>
                                  </div>

                                  {/* Vote Count - Transparent Overlay */}
                                  <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-center border border-white/20">
                                      <div className="text-white font-bold text-2xl leading-none">
                                        {candidate.totalVotes.toLocaleString()}
                                      </div>
                                      <div className="text-white/80 text-xs leading-none mt-1">
                                        Votes
                                      </div>
                                    </div>
                                  </div>

                                  <CardHeader className="pb-3 pt-6">
                                    <CardTitle className="text-xl text-balance leading-tight text-center">
                                      {candidate.name}
                                    </CardTitle>
                                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {cat.totalVotes.toLocaleString()} total
                                        suara
                                      </div>
                                    </div>
                                  </CardHeader>

                                  <CardContent className="space-y-4">
                                    {/* Progress Bar */}
                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">
                                          Persentase
                                        </span>
                                        <span className="text-sm font-bold text-muted-foreground">
                                          {candidate.percentage.toFixed(1)}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={candidate.percentage}
                                        className="h-3"
                                      />
                                    </div>

                                    {/* Vote Button */}
                                    <Button
                                      className={cn(
                                        "w-full font-semibold transition-all duration-200",
                                        !isAuthenticated || userPoints === 0
                                          ? "bg-blue-600 hover:bg-blue-700"
                                          : "bg-primary hover:bg-primary/90"
                                      )}
                                      size="lg"
                                      onClick={() =>
                                        handleVoteClick(candidate, cat)
                                      }
                                    >
                                      <Star className="mr-2 h-4 w-4" />
                                      {getVoteButtonText()}
                                    </Button>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>

                          {/* Remaining Candidates in Responsive Table */}
                          {remainingCandidates.length > 0 && (
                            <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-4">
                                Kandidat Lainnya
                              </h3>

                              {/* Desktop Table */}
                              <div className="hidden md:block border rounded-lg overflow-hidden">
                                {remainingCandidates.map(
                                  (
                                    candidate: CandidateWithVotes,
                                    index: number
                                  ) => (
                                    <div
                                      key={candidate.id}
                                      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-4">
                                        <span className="font-medium text-muted-foreground w-8 text-center">
                                          #{index + 4}
                                        </span>
                                        <span className="font-medium">
                                          {candidate.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                          <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                                            {candidate.totalVotes.toLocaleString()}{" "}
                                            votes
                                          </span>
                                          <div className="w-32">
                                            <Progress
                                              value={candidate.percentage}
                                              className="h-2"
                                            />
                                          </div>
                                          <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                                            {candidate.percentage.toFixed(1)}%
                                          </span>
                                        </div>
                                        <Button
                                          size="sm"
                                          className={cn(
                                            !isAuthenticated || userPoints === 0
                                              ? "bg-blue-600 hover:bg-blue-700"
                                              : ""
                                          )}
                                          onClick={() =>
                                            handleVoteClick(candidate, cat)
                                          }
                                        >
                                          <Star className="mr-2 h-3 w-3" />
                                          {!isAuthenticated
                                            ? "Login"
                                            : userPoints === 0
                                            ? "Beli Poin"
                                            : "Vote"}
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>

                              {/* Mobile Cards */}
                              <div className="md:hidden space-y-3">
                                {remainingCandidates.map(
                                  (
                                    candidate: CandidateWithVotes,
                                    index: number
                                  ) => (
                                    <Card key={candidate.id} className="p-4">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                          <span className="font-medium text-muted-foreground text-sm">
                                            #{index + 4}
                                          </span>
                                          <span className="font-medium">
                                            {candidate.name}
                                          </span>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm font-bold text-muted-foreground">
                                            {candidate.totalVotes.toLocaleString()}{" "}
                                            votes
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {candidate.percentage.toFixed(1)}%
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="flex-1">
                                          <Progress
                                            value={candidate.percentage}
                                            className="h-2"
                                          />
                                        </div>
                                      </div>
                                      <Button
                                        className={cn(
                                          "w-full",
                                          !isAuthenticated || userPoints === 0
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : ""
                                        )}
                                        onClick={() =>
                                          handleVoteClick(candidate, cat)
                                        }
                                      >
                                        <Star className="mr-2 h-3 w-3" />
                                        {getVoteButtonText()}
                                      </Button>
                                    </Card>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          <div className="text-center">
                            <Button variant="outline" size="lg" asChild>
                              <Link href={`/event/${ev.id}/category/${cat.id}`}>
                                Lihat Detail Kategori
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
            <DialogTitle>Berikan Suara Anda</DialogTitle>
            <DialogDescription>
              Berikan suara untuk <strong>{selectedCandidate?.name}</strong>.
              Setiap poin sama dengan satu suara.
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6 py-4">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedCandidate.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Saat ini: {selectedCandidate.currentPercentage}%
                  </p>
                </div>
              </div>

              {/* Points Input */}
              <div className="space-y-2">
                <Label htmlFor="points">Berapa poin yang akan digunakan?</Label>
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
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Poin yang digunakan:</span>
                  <span className="font-bold text-primary">{votePoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sisa poin:</span>
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
              Batal
            </Button>
            <Button
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
    </>
  );
}
