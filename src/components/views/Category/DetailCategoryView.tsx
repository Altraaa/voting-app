"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Users, ArrowLeft, Star, Trophy, Coins, Clock, Calendar } from "lucide-react";
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
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useSettings } from "@/config/hooks/SettingsHook/useSettings";

export default function DetailCategoryView() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const eventId = params.id as string;

  const { queries: categoryQueries } = useCategories();
  const { mutations: voteMutations } = useVotes();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUser();
  const { queries: candidateQueries } = useCandidates();
  const { queries: eventQueries } = useEvent();
  const { queries: settingsQueries } = useSettings();
  const { data: settings } = settingsQueries.useGetSettings();
  const showTotalVotes = settings?.showTotalVotes ?? true;

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

  // Fetch event data by ID
  const { data: eventData, isLoading: eventLoading } =
    eventQueries.useGetEventById(eventId);

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
  const pointsPerVote = eventData?.pointsPerVote || 1;

  // Calculate max points that can be used (multiple of pointsPerVote)
  const maxPoints = Math.floor(userPoints / pointsPerVote) * pointsPerVote;
  const minPoints = pointsPerVote;
  
  // Calculate slider values
  const sliderMax = Math.min(1000, maxPoints);
  const sliderStep = pointsPerVote;

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

  const getCandidateVotes = (votes: IVotes[]) => {
    if (!votes || votes.length === 0) return 0;
    
    // Hitung total poin
    const totalPoints = votes.reduce((sum, vote) => sum + vote.pointsUsed, 0);
    
    // Konversi ke suara berdasarkan pointsPerVote
    return Math.floor(totalPoints / pointsPerVote);
  };

  // Fungsi untuk menghitung total poin (untuk display saja)
  const getCandidatePoints = (votes: IVotes[]) => {
    return votes?.reduce((sum, vote) => sum + vote.pointsUsed, 0) || 0;
  };

  const getTotalVotes = () => {
    if (!candidatesData) return 0;
    return candidatesData.reduce((sum, candidate) => {
      const candidateVotes = getCandidateVotes(candidate.votes);
      return sum + candidateVotes;
    }, 0);
  };

  const getCandidatePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? ((votes / total) * 100).toFixed(1) : "0.0";
  };

  const handleVoteClick = (candidate: ICandidate) => {
    // Cek status event sebelum membuka dialog vote
    if (!eventData) {
      toast.error("Event data tidak ditemukan");
      return;
    }

    // Cek jika event belum dimulai
    if (eventData.status === "upcoming") {
      toast.error("Event belum dimulai, voting belum dapat dilakukan");
      return;
    }

    // Cek jika event sudah berakhir
    if (eventData.status === "ended") {
      toast.error("Event telah berakhir, voting tidak dapat dilakukan");
      return;
    }

    // Jika belum login, arahkan ke halaman login
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    // Jika sudah login tapi tidak memiliki poin, arahkan ke halaman beli poin
    if (userPoints === 0) {
      window.location.href = "/points";
      return;
    }

    const votes = getCandidateVotes(candidate.votes);
    const percentage = getCandidatePercentage(votes);

    setSelectedCandidate({
      id: candidate.id,
      name: candidate.name,
      photo_url: candidate.photo_url,
      currentVotes: votes,
      currentPercentage: percentage,
    });
    setVotePoints(pointsPerVote);
    setIsDialogOpen(true);
  };

  const handleVote = async () => {
    if (!selectedCandidate || !isAuthenticated) {
      toast.error("Silakan login untuk melakukan vote");
      return;
    }

    // Validasi event status
    if (!eventData) {
      toast.error("Event data tidak ditemukan");
      return;
    }

    if (eventData.status === "upcoming") {
      toast.error("Event belum dimulai");
      return;
    }

    if (eventData.status === "ended") {
      toast.error("Event telah berakhir");
      return;
    }

    // Validasi jumlah poin minimal sesuai pointsPerVote
    if (votePoints < pointsPerVote) {
      toast.error(`Minimal ${pointsPerVote} poin untuk 1 vote`);
      return;
    }

    // Validasi kelipatan poin sesuai pointsPerVote
    if (votePoints % pointsPerVote !== 0) {
      toast.error(`Poin harus kelipatan ${pointsPerVote}`);
      return;
    }

    if (votePoints > userPoints) {
      toast.error("Poin tidak mencukupi");
      return;
    }

    try {
      await voteMutations.createMutation.mutateAsync({
        candidateId: selectedCandidate.id,
        pointsUsed: votePoints,
      });

      // Hitung jumlah suara berdasarkan pointsPerVote
      const votesReceived = votePoints / pointsPerVote;
      toast.success(`Berhasil vote! ${votePoints} poin = ${votesReceived} suara`);
      setIsDialogOpen(false);
      setSelectedCandidate(null);
      setVotePoints(pointsPerVote);
    } catch (error: any) {
      console.error("Error voting:", error);
      // Tampilkan pesan error dari backend jika ada
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Gagal melakukan vote. Silakan coba lagi.");
      }
    }
  };

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    
    // Pastikan nilai adalah kelipatan pointsPerVote
    const adjustedValue = Math.floor(numValue / pointsPerVote) * pointsPerVote;
    
    // Batasi antara minPoints dan maxPoints
    if (adjustedValue <= maxPoints) {
      setVotePoints(Math.max(minPoints, adjustedValue));
    } else {
      setVotePoints(maxPoints);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    // Pastikan nilai adalah kelipatan pointsPerVote
    const adjustedValue = Math.floor(newValue / pointsPerVote) * pointsPerVote;
    setVotePoints(Math.max(minPoints, adjustedValue));
  };

  // Combined loading state
  const isLoading = categoryLoading || candidatesLoading || eventLoading || authLoading;

  // Check event status for UI
  const isEventUpcoming = eventData?.status === "upcoming";
  const isEventLive = eventData?.status === "live";
  const isEventEnded = eventData?.status === "ended";

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (!eventData) {
    return (
      <div className="px-4 lg:px-8 py-20 text-center">
        <h1 className="text-xl font-bold mb-4">Event Tidak Ditemukan</h1>
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
              {showTotalVotes && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {totalVotes.toLocaleString()} total suara
                </div>
              )}
              {/* Status Event Badge */}
              <Badge
                variant={
                  isEventUpcoming ? "secondary" :
                  isEventLive ? "default" :
                  "destructive"
                }
                className="text-sm"
              >
                {isEventUpcoming && (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Akan Datang
                  </>
                )}
                {isEventLive && (
                  <>
                    <Calendar className="w-3 h-3 mr-1" />
                    Sedang Berlangsung
                  </>
                )}
                {isEventEnded && (
                  <>
                    <Calendar className="w-3 h-3 mr-1" />
                    Telah Berakhir   
                  </>
                )}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-balance mb-4">
              {categoryData.name}
            </h1>

            {/* User Points Display */}
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
                {/* Button Beli Poin / Login untuk beli poin */}
                {userPoints === 0 ? (
                  <Button asChild size="sm">
                    <Link href={isAuthenticated ? "/points" : "/login"}>
                      <Star className="mr-2 h-4 w-4" />
                      {isAuthenticated ? "Beli Poin" : "Login untuk beli poin"}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="outline">
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

      {/* Event Status Banner */}
      {isEventUpcoming && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Event Belum Dimulai</h3>
              <p className="text-sm text-yellow-700">
                Voting akan dibuka pada {formatDate(eventData.startDate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {isEventEnded && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Event Telah Berakhir</h3>
            </div>
          </div>
        </div>
      )}

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
                <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                  <Coins className="w-3 h-3 inline mr-1" />
                  {pointsPerVote} poin = 1 suara
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Suara</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {votes.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  disabled={isEventUpcoming || isEventEnded || authLoading || !isAuthenticated || userPoints === 0}
                  onClick={() => handleVoteClick(candidate)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {!isAuthenticated
                    ? "Login untuk Vote"
                    : isEventUpcoming
                    ? "Event Belum Dimulai"
                    : isEventEnded
                    ? "Event Telah Berakhir"
                    : userPoints === 0
                    ? "Beli Poin untuk Vote"
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
              Vote untuk <strong>{selectedCandidate?.name}</strong>.
              {pointsPerVote === 1 
                ? " Setiap 1 poin = 1 suara."
                : ` Setiap ${pointsPerVote} poin = 1 suara.`}
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-4 py-2">
              {/* Event Status Warning */}
              {isEventUpcoming && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Event belum dimulai. Voting akan dibuka pada {formatDate(eventData.startDate)}
                  </p>
                </div>
              )}

              {isEventEnded && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ❌ Event telah berakhir. Voting tidak dapat dilakukan.
                  </p>
                </div>
              )}

              {/* Candidate Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="relative aspect-[4/5] bg-muted/30 overflow-hidden">
                  <Image
                    key={selectedCandidate.photo_url} 
                    src={selectedCandidate.photo_url || "/placeholder-candidate.jpg"}
                    alt={selectedCandidate.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    unoptimized={false} 
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

              {/* Points Input dengan Slider */}
              <div className="space-y-4">
                <Label htmlFor="points-slider" className="text-sm">
                  Jumlah poin yang akan digunakan:
                  <span className="text-xs text-muted-foreground ml-2">
                    ({pointsPerVote} poin = 1 suara)
                  </span>
                </Label>

                {/* Slider untuk memilih poin */}
                {maxPoints >= minPoints ? (
                  <div className="space-y-2">
                    <div className="pt-6 pb-2">
                      <Slider
                        id="points-slider"
                        min={minPoints}
                        max={sliderMax}
                        step={sliderStep}
                        value={[votePoints]}
                        onValueChange={handleSliderChange}
                        disabled={isEventUpcoming || isEventEnded || userPoints === 0}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{minPoints} poin</span>
                        <span>{sliderMax} poin</span>
                      </div>
                    </div>
                    
                    {/* Display current value */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {votePoints} poin
                      </div>
                      <div className="text-sm text-muted-foreground">
                        = {Math.floor(votePoints / pointsPerVote)} suara
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Anda tidak memiliki cukup poin untuk vote.
                      Minimal dibutuhkan {pointsPerVote} poin.
                    </p>
                  </div>
                )}

                {/* Input Number sebagai backup */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="points-input"
                      type="number"
                      min={minPoints}
                      max={maxPoints}
                      step={sliderStep}
                      value={votePoints}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      className="flex-1 text-sm"
                      disabled={isEventUpcoming || isEventEnded || userPoints === 0}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVotePoints(maxPoints)}
                      disabled={userPoints === 0 || isEventUpcoming || isEventEnded}
                    >
                      Maks
                    </Button>
                  </div>
                  
                  {/* Validasi kelipatan */}
                  {votePoints > 0 && votePoints % pointsPerVote !== 0 && (
                    <p className="text-xs text-red-500">
                      Poin harus kelipatan {pointsPerVote}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Tersedia: {userPoints} poin • Menggunakan: {votePoints} poin
                  </p>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 5, 10].map((multiplier) => {
                  const amount = multiplier * pointsPerVote;
                  const isDisabled = amount > maxPoints || 
                                    userPoints === 0 || 
                                    (userPoints < pointsPerVote && amount > 0) ||
                                    isEventUpcoming ||
                                    isEventEnded;
                  
                  return (
                    <Button
                      key={multiplier}
                      variant="outline"
                      size="sm"
                      onClick={() => setVotePoints(amount)}
                      disabled={isDisabled}
                    >
                      {amount}p
                    </Button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Poin yang akan digunakan:</span>
                  <span className="font-bold text-primary text-sm">
                    {votePoints}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Suara yang diterima:</span>
                  <span className="font-bold text-primary text-sm">
                    {Math.floor(votePoints / pointsPerVote)}
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
                voteMutations.createMutation.isPending ||
                votePoints < 1 ||
                isEventUpcoming ||
                isEventEnded ||
                votePoints % pointsPerVote !== 0
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