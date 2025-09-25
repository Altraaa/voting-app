"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Users,
  CalendarClock,
  Trophy,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

type Status = "Live" | "Upcoming" | "Ended";

type Candidate = {
  id: string | number;
  name: string;
  votes: number;
};

type Category = {
  id: string | number;
  title: string;
  candidates?: Candidate[];
};

type EventInfo = {
  id: string;
  title: string;
  description: string;
  status: Status;
  endsAtLabel: string;
  participants: number;
  categoriesCount: number;
  trending?: boolean;
  categories?: Category[];
};

const EVENTS: EventInfo[] = [
  {
    id: "indo-music-awards-2025",
    title: "Indo Music Awards 2025",
    description:
      "Vote your favorite artists across Best Singer, Best Band, and more. Real-time, secure, and transparent.",
    status: "Live",
    endsAtLabel: "Ends Sep 30, 2025",
    participants: 24,
    categoriesCount: 6,
    trending: true,
    categories: [
      { id: "best-singer", title: "Best Singer" },
      { id: "best-band", title: "Best Band" },
      { id: "rising-star", title: "Rising Star" },
    ],
  },
  {
    id: "culinary-fest-2025",
    title: "Culinary Fest Favorites",
    description:
      "Discover Indonesia's favorite dishes. Vote and see results instantly across multiple food categories.",
    status: "Upcoming",
    endsAtLabel: "Starts Oct 12, 2025",
    participants: 18,
    categoriesCount: 5,
    categories: [
      { id: "main-dish", title: "Main Dish" },
      { id: "street-food", title: "Street Food" },
      { id: "dessert", title: "Dessert" },
    ],
  },
  {
    id: "film-awards-2025",
    title: "Best Indonesian Movie 2025",
    description:
      "Support your favorite films and creators. Vote for best movie, actor, and director.",
    status: "Live",
    endsAtLabel: "Ends Nov 15, 2025",
    participants: 15,
    categoriesCount: 4,
    trending: true,
    categories: [
      { id: "best-movie", title: "Best Movie" },
      { id: "best-actor", title: "Best Actor" },
      { id: "best-director", title: "Best Director" },
    ],
  },
  {
    id: "tech-awards-2025",
    title: "Tech Product Awards 2025",
    description: "Vote the most innovative products and startups of the year.",
    status: "Ended",
    endsAtLabel: "Ended Aug 02, 2025",
    participants: 30,
    categoriesCount: 7,
    categories: [
      { id: "best-startup", title: "Best Startup" },
      { id: "best-app", title: "Best App" },
      { id: "best-gadget", title: "Best Gadget" },
    ],
  },
];

export default function EventsView() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | Status>("all");

  const filtered = useMemo(() => {
    let list = [...EVENTS];
    if (tab !== "all") list = list.filter((e) => e.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, tab]);

  return (
    <main className="py-28 px-4 lg:px-20">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">
          All <span className="text-primary">Events</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Telusuri semua event voting dengan update hasil real-time. Filter
          berdasarkan status atau cari event favoritmu.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between mb-8">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            aria-label="Search events"
          />
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="md:w-auto w-full"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Live">Live</TabsTrigger>
            <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="Ended">Ended</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((ev) => (
          <Card
            key={ev.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                {ev.status === "Live" ? (
                  <Badge className="bg-primary text-primary-foreground">
                    Live
                  </Badge>
                ) : (
                  <Badge variant="secondary">{ev.status}</Badge>
                )}
                {ev.trending && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" /> Trending
                  </Badge>
                )}
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <CalendarClock className="w-4 h-4" />
                  {ev.endsAtLabel}
                </div>
              </div>

              <CardTitle className="text-xl md:text-2xl text-balance leading-tight">
                {ev.title}
              </CardTitle>

              <p className="text-muted-foreground text-pretty">
                {ev.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {ev.participants} candidates
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {ev.categoriesCount} categories
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {ev.categories && ev.categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {ev.categories.slice(0, 4).map((c) => (
                      <Badge key={c.id} variant="outline">
                        {c.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild>
                  <Link href={`/category`}>Browse Categories</Link>
                </Button>
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href={`/`}>View Event</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No events match your filters.
        </div>
      )}

      <div className="text-center mt-12">
        <Button variant="ghost" asChild>
          <Link href="/">
            Back to Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
