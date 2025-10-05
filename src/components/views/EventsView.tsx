"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  // Users,
  CalendarClock,
  Trophy,
  ArrowRight,
  // TrendingUp,
  Users2Icon,
} from "lucide-react";
import { StatusEvent } from "@/generated/prisma";
import { IEvent } from "@/config/models/EventModel";
import { useEventQueries } from "@/config/hooks/EventHook/eventQueries";

type Status = "Live" | "Upcoming" | "Ended";

const mapStatus = (status: StatusEvent): Status => {
  switch (status) {
    case "live":
      return "Live";
    case "upcoming":
      return "Upcoming";
    case "ended":
      return "Ended";
    default:
      return "Upcoming";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getEventStatusLabel = (event: IEvent): string => {
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (event.status === "ended" || endDate < now) {
    return `Ended ${formatDate(event.endDate)}`;
  } else if (event.status === "live" || (startDate <= now && endDate >= now)) {
    return `Ends ${formatDate(event.endDate)}`;
  } else {
    return `Starts ${formatDate(event.startDate)}`;
  }
};

export default function EventsView() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | Status>("all");

  const {
    data: eventsData,
    isLoading,
    error,
  } = useEventQueries.useGetAllEvents();

  const events = useMemo(() => {
    if (!eventsData) return [];

    return eventsData.map((event) => ({
      id: event.id,
      title: event.name,
      description: event.description,
      status: mapStatus(event.status),
      endsAtLabel: getEventStatusLabel(event),
      participants: event.users?.length || 0,
      categoriesCount: event.categories?.length || 0,
      candidateCount:
        event.categories?.reduce(
          (total, category) => total + (category._count?.candidates || 0),
          0
        ) || 0,
      categories: event.categories?.map((category) => ({
        id: category.id,
        title: category.name,
      })),
    }));
  }, [eventsData]);

  const filtered = useMemo(() => {
    let list = [...events];
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
  }, [query, tab, events]);

  if (isLoading) {
    return (
      <main className="py-28 px-4 lg:px-20">
        <div className="text-center">Loading events...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-28 px-4 lg:px-20">
        <div className="text-center text-red-500">
          Error loading events: something went wrong
        </div>
      </main>
    );
  }

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
          onValueChange={(v) => setTab(v as Status)}
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
                {/* Trending badge bisa diimplementasikan berdasarkan logic bisnis */}
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
                  <Users2Icon className="w-4 h-4" />
                  {ev.candidateCount} candidates
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
                    {ev.categories.length > 4 && (
                      <Badge variant="outline">
                        +{ev.categories.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild>
                  <Link href={`/event/${ev.id}/category`}>View Event</Link>
                </Button>
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link
                    href={`/event/${ev.id}/category/${ev.categories[0].id}`}
                  >
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
