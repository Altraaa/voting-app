import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: 1,
    title: "Best Indonesian Singer 2024",
    description: "Vote for your favorite Indonesian singer of the year",
    totalVotes: 15420,
    participants: 8,
    trending: true,
    status: "active",
    endDate: "2024-12-31",
    image: "/placeholder-v04zn.png",
  },
  {
    id: 2,
    title: "Favorite Indonesian Food",
    description: "Choose the most beloved traditional Indonesian dish",
    totalVotes: 12890,
    participants: 12,
    trending: false,
    status: "active",
    endDate: "2024-12-25",
    image: "/placeholder-ncrma.png",
  },
  {
    id: 3,
    title: "Best Indonesian Movie 2024",
    description: "Vote for the most outstanding Indonesian film this year",
    totalVotes: 9650,
    participants: 6,
    trending: true,
    status: "active",
    endDate: "2024-12-30",
    image: "/placeholder-q4fvm.png",
  },
  {
    id: 4,
    title: "Most Beautiful Indonesian Tourist Destination",
    description: "Select the most stunning tourist spot in Indonesia",
    totalVotes: 8340,
    participants: 15,
    trending: false,
    status: "active",
    endDate: "2025-01-15",
    image: "/placeholder-qrzyf.png",
  },
  {
    id: 5,
    title: "Best Indonesian Football Player",
    description: "Vote for the top Indonesian football talent",
    totalVotes: 7220,
    participants: 10,
    trending: false,
    status: "active",
    endDate: "2024-12-28",
    image: "/placeholder-s7ukp.png",
  },
  {
    id: 6,
    title: "Favorite Indonesian YouTuber",
    description: "Choose your favorite Indonesian content creator",
    totalVotes: 11500,
    participants: 20,
    trending: true,
    status: "active",
    endDate: "2025-01-10",
    image: "/youtuber-content-creator-setup.jpg",
  },
];

export default function CategoryView() {
  return (
    <div className="px-20 py-28">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">
          Voting <span className="text-primary">Categories</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Explore all available voting categories. Cast your votes and see
          real-time results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
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
            </div>

            <CardHeader>
              <CardTitle className="text-lg text-balance leading-tight">
                {category.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground text-pretty">
                {category.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {category.totalVotes.toLocaleString()} votes
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Ends {new Date(category.endDate).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {category.participants} candidates
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 40 + 20)}% leading
                  </span>
                </div>
                <Progress
                  value={Math.floor(Math.random() * 40 + 20)}
                  className="h-2"
                />
              </div>

              <Button asChild className="w-full">
                <Link href={`/category/${category.id}`}>
                  View & Vote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
