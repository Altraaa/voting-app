// components/LeaderboardSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useCandidates } from "@/config/hooks/CandidateHook/useCandidate";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";

type Candidate = {
  id: string;
  name: string;
  votes: number;
  photo_url?: string;
};

type Category = {
  id: string;
  title: string;
  candidates: Candidate[];
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

  const { data: events = [], isLoading: eventsLoading } =
    eventQueries.useGetAllEvents();
  const { data: categories = [], isLoading: categoriesLoading } =
    categoryQueries.useGetAllCategories();
  const { data: candidates = [], isLoading: candidatesLoading } =
    candidateQueries.useGetAllCandidates();

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

            // Urutkan berdasarkan votes (descending) dan ambil top 3
            const topCandidates = categoryCandidates
              .sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))
              .slice(0, 3)
              .map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                votes: candidate.votes?.length || 0,
                photo_url: candidate.photo_url,
              }));

            return {
              id: category.id,
              title: category.name,
              candidates: topCandidates,
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
    return null; // Tidak render jika tidak ada data
  }

  return (
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

      <Tabs defaultValue={leaderboardEvents[0]?.id} className="w-full">
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
            <Link href="/events">
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
                      <Link href={`/events/${ev.id}`}>
                        View Event
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {ev.categories.map((cat) => {
                    const totalVotes = cat.candidates.reduce(
                      (a, c) => a + c.votes,
                      0
                    );
                    return (
                      <TabsContent key={cat.id} value={cat.id}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
                          {cat.candidates.map((c, index) => {
                            const pct =
                              totalVotes > 0
                                ? Math.round((c.votes / totalVotes) * 1000) / 10
                                : 0;
                            return (
                              <Card
                                key={c.id}
                                className="relative overflow-hidden hover:shadow-lg transition-shadow"
                              >
                                {index === 0 && (
                                  <div className="absolute top-4 right-4">
                                    <Badge className="bg-primary text-primary-foreground">
                                      <Trophy className="w-3 h-3 mr-1" />
                                      #1
                                    </Badge>
                                  </div>
                                )}
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg text-balance leading-tight">
                                    {c.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {totalVotes.toLocaleString()} total votes
                                    </div>
                                    <div>{index + 1} place</div>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">Share</span>
                                      <span className="text-sm text-muted-foreground">
                                        {pct}%
                                      </span>
                                    </div>
                                    <Progress value={pct} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {c.votes.toLocaleString()} votes
                                    </p>
                                  </div>

                                  <Button asChild className="w-full">
                                    <Link href={`/vote?candidate=${c.id}`}>
                                      Vote Now
                                    </Link>
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        <div className="text-center">
                          <Button variant="outline" size="lg" asChild>
                            <Link href={`/categories/${cat.id}`}>
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
  );
}