"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

type Candidate = {
  id: string;
  name: string;
  votes: number;
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

const events: EventLeaderboard[] = [
  {
    id: "indo-music-awards-2025",
    title: "Indo Music Awards 2025",
    trending: true,
    categories: [
      {
        id: "best-singer",
        title: "Best Singer",
        candidates: [
          { id: "raisa", name: "Raisa", votes: 4850 },
          { id: "agnzmo", name: "Agnez Mo", votes: 3185 },
          { id: "mahalini", name: "Mahalini", votes: 2110 },
        ],
      },
      {
        id: "best-band",
        title: "Best Band",
        candidates: [
          { id: "noah", name: "NOAH", votes: 2640 },
          { id: "sheila", name: "Sheila on 7", votes: 2310 },
          { id: "kotak", name: "Kotak", votes: 1890 },
        ],
      },
      {
        id: "rising-star",
        title: "Rising Star",
        candidates: [
          { id: "lyodra", name: "Lyodra", votes: 1980 },
          { id: "tiarap", name: "Tiara Andini", votes: 1765 },
          { id: "marion", name: "Marion Jola", votes: 1520 },
        ],
      },
    ],
  },
  {
    id: "culinary-fest-2025",
    title: "Culinary Fest Favorites",
    trending: false,
    categories: [
      {
        id: "main-dish",
        title: "Main Dish",
        candidates: [
          { id: "rendang", name: "Rendang", votes: 3890 },
          { id: "nasi-goreng", name: "Nasi Goreng", votes: 2055 },
          { id: "rawon", name: "Rawon", votes: 1680 },
        ],
      },
      {
        id: "street-food",
        title: "Street Food",
        candidates: [
          { id: "sate", name: "Sate Ayam", votes: 3215 },
          { id: "pempek", name: "Pempek", votes: 2470 },
          { id: "siomay", name: "Siomay", votes: 1410 },
        ],
      },
      {
        id: "dessert",
        title: "Dessert",
        candidates: [
          { id: "es-teler", name: "Es Teler", votes: 1320 },
          { id: "klepon", name: "Klepon", votes: 1190 },
          { id: "serabi", name: "Serabi", votes: 990 },
        ],
      },
    ],
  },
  {
    id: "film-awards-2025",
    title: "Best Indonesian Movie 2025",
    trending: true,
    categories: [
      {
        id: "best-movie",
        title: "Best Movie",
        candidates: [
          { id: "pengabdi2", name: "Pengabdi Setan 2", votes: 2895 },
          { id: "laskar-pelangi", name: "Laskar Pelangi", votes: 1980 },
          { id: "yowis-ben", name: "Yowis Ben", votes: 1520 },
        ],
      },
      {
        id: "best-actor",
        title: "Best Actor",
        candidates: [
          { id: "iqbaal", name: "Iqbaal Ramadhan", votes: 2130 },
          { id: "revaldo", name: "Revaldo", votes: 1760 },
          { id: "reza", name: "Reza Rahadian", votes: 1640 },
        ],
      },
      {
        id: "best-director",
        title: "Best Director",
        candidates: [
          { id: "joko-anj", name: "Joko Anwar", votes: 1895 },
          { id: "hanung", name: "Hanung Bramantyo", votes: 1555 },
          { id: "rizal-mantovani", name: "Rizal Mantovani", votes: 1380 },
        ],
      },
    ],
  },
];

// function formatNumber(n: number) {
//   return n.toLocaleString();
// }

export default function LeaderboardSection() {
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

      <Tabs defaultValue={events[0]?.id} className="w-full">
        <div className="flex items-center justify-between gap-4 mb-8">
          <TabsList className="flex flex-wrap">
            {events.map((ev, idx) => (
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
            <Link href="/">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {events.map((ev) => {
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
                      <Link href="/">
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
                                    <Link href="/">
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
                            <Link href="/">
                              View Event Details
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