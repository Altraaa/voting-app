"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Clock, TrendingUp, Vote, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

// Mock data for category details
const categoryData = {
  1: {
    title: "Best Indonesian Singer 2024",
    description:
      "Vote for your favorite Indonesian singer of the year. This category celebrates the most talented vocalists who have made significant contributions to Indonesian music scene.",
    totalVotes: 15420,
    endDate: "2024-12-31",
    trending: true,
    status: "active",
    candidates: [
      {
        id: 1,
        name: "Raisa",
        description: "Pop singer known for her soulful voice and hit songs",
        votes: 4850,
        percentage: 31.4,
        image: "/indonesian-female-singer-raisa.jpg",
      },
      {
        id: 2,
        name: "Afgan",
        description: "R&B and pop singer with multiple platinum albums",
        votes: 3920,
        percentage: 25.4,
        image: "/indonesian-male-singer-afgan.jpg",
      },
      {
        id: 3,
        name: "Isyana Sarasvati",
        description: "Classical-trained singer with operatic vocal range",
        votes: 3150,
        percentage: 20.4,
        image: "/indonesian-female-singer-isyana.jpg",
      },
      {
        id: 4,
        name: "Rizky Febian",
        description: "Young talented singer and songwriter",
        votes: 2100,
        percentage: 13.6,
        image: "/indonesian-male-singer-rizky-febian.jpg",
      },
      {
        id: 5,
        name: "Tulus",
        description: "Indie pop singer with unique vocal style",
        votes: 1400,
        percentage: 9.1,
        image: "/indonesian-male-singer-tulus.jpg",
      },
    ],
  },
};

export default function DetailCategoryView() {
  const params = useParams();
  const categoryId = Number.parseInt(params.id as string);
  const category = categoryData[categoryId as keyof typeof categoryData];
  const [isVoting, setIsVoting] = useState(false);
  const [userPoints] = useState(10); // Mock user points

  if (!category) {
    return (
      <div className="px-20 py-28 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Button asChild>
          <Link href="/category">Back to Categories</Link>
        </Button>
      </div>
    );
  }

//   const handleVote = async () => {
//     setIsVoting(true);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setIsVoting(false);
//     setSelectedCandidate(null);
//     // In real app, update vote counts and user points
//   };

  return (
    <div className="px-20 py-28">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/category">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>

      {/* Category Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="flex justify-center gap-2 mb-4">
          {category.trending && (
            <Badge className="bg-primary text-primary-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          <Badge variant="secondary">
            {category.status === "active" ? "Active" : "Ended"}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-balance">
          {category.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          {category.description}
        </p>

        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {category.totalVotes.toLocaleString()} total votes
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Ends {new Date(category.endDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* User Points Display */}
      <div className="bg-card rounded-lg p-4 mb-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Your Voting Points</p>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <span className="text-2xl font-bold text-primary">{userPoints}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        {userPoints === 0 && (
          <Button size="sm" className="mt-2" asChild>
            <Link href="/points">Buy More Points</Link>
          </Button>
        )}
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Image
                src={candidate.image || "/placeholder.svg"}
                alt={candidate.name}
                fill
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/90 text-foreground">
                  #
                  {category.candidates.findIndex((c) => c.id === candidate.id) +
                    1}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-xl">{candidate.name}</CardTitle>
              <p className="text-sm text-muted-foreground text-pretty">
                {candidate.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Votes</span>
                  <span className="text-sm text-muted-foreground">
                    {candidate.percentage}%
                  </span>
                </div>
                <Progress value={candidate.percentage} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">
                  {candidate.votes.toLocaleString()} votes
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={userPoints === 0}
                  >
                    <Vote className="mr-2 h-4 w-4" />
                    Vote (1 point)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Your Vote</DialogTitle>
                    <DialogDescription>
                      You are about to vote for{" "}
                      <strong>{candidate.name}</strong> in the category &quot;
                      {category.title}&quot;. This will cost 1 voting point.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center justify-center space-x-4">
                      <Image
                        src={candidate.image || "/placeholder.svg"}
                        alt={candidate.name}
                        fill
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {candidate.votes.toLocaleString()} votes (
                          {candidate.percentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isVoting}
                    >
                      {isVoting ? "Voting..." : "Confirm Vote"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
