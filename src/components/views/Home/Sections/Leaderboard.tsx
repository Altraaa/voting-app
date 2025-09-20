import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const topCategories = [
  {
    id: 1,
    title: "Best Indonesian Singer 2024",
    totalVotes: 15420,
    participants: 8,
    trending: true,
    topCandidate: "Raisa",
    topCandidateVotes: 4850,
    topCandidatePercentage: 31.4,
  },
  {
    id: 2,
    title: "Favorite Indonesian Food",
    totalVotes: 12890,
    participants: 12,
    trending: false,
    topCandidate: "Rendang",
    topCandidateVotes: 3890,
    topCandidatePercentage: 30.2,
  },
  {
    id: 3,
    title: "Best Indonesian Movie 2024",
    totalVotes: 9650,
    participants: 6,
    trending: true,
    topCandidate: "Pengabdi Setan 2",
    topCandidateVotes: 2895,
    topCandidatePercentage: 30.0,
  },
];

export default function LeaderboardSection() {
  return (
    <section className="py-20 px-4 lg:px-20 bg-card/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-balance">
          Live Voting <span className="text-primary">Leaderboard</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          See what&apos;s trending right now. Real-time results from our most
          popular voting categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
        {topCategories.map((category, index) => (
          <Card
            key={category.id}
            className="relative overflow-hidden hover:shadow-lg transition-shadow"
          >
            {index === 0 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Trophy className="w-3 h-3 mr-1" />
                  #1 Trending
                </Badge>
              </div>
            )}

            {category.trending && index !== 0 && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-balance leading-tight">
                {category.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {category.totalVotes.toLocaleString()} votes
                </div>
                <div>{category.participants} candidates</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    Leading: {category.topCandidate}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {category.topCandidatePercentage}%
                  </span>
                </div>
                <Progress
                  value={category.topCandidatePercentage}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {category.topCandidateVotes.toLocaleString()} votes
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href={`/category/${category.id}`}>Vote Now</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/category">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
