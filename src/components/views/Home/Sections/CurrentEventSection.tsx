// components/CurrentEventSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { ICategories } from "@/config/models/CategoriesModel";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";

type EventInfo = {
  id: string;
  title: string;
  description: string;
  status: "live" | "upcoming" | "ended";
  endsAtLabel: string;
  categories: number;
};

export default function CurrentEventSection() {
  const { queries: eventQueries } = useEvent();
  const { queries: categoryQueries } = useCategories();

  const { data: events = [], isLoading: eventsLoading } =
    eventQueries.useGetAllEvents();
  const { data: categories = [], isLoading: categoriesLoading } =
    categoryQueries.useGetAllCategories();

  const getCurrentEvent = (): EventInfo | null => {
    if (eventsLoading || categoriesLoading || events.length === 0) {
      return null;
    }

    const currentEvent =
      events.find(
        (event) =>
          event.status?.toLowerCase() === "live" ||
          event.status?.toLowerCase() === "active"
      ) || events[0]; 

    if (!currentEvent) return null;

    const eventCategories = categories.filter(
      (cat: ICategories) => cat.eventId === currentEvent.id
    );

    const endsAt = currentEvent.endDate ? new Date(currentEvent.endDate) : null;
    const endsAtLabel = endsAt
      ? `Ends ${endsAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : "Ongoing";

    let status: "Live" | "Upcoming" | "Ended" = "Live";
    const now = new Date();
    if (currentEvent.startDate && new Date(currentEvent.startDate) > now) {
      status = "Upcoming";
    } else if (currentEvent.endDate && new Date(currentEvent.endDate) < now) {
      status = "Ended";
    }

    return {
      id: currentEvent.id,
      title: currentEvent.name || "Current Event",
      description:
        currentEvent.description ||
        "Join the current voting event and support your favorites.",
      status: currentEvent.status || status,
      endsAtLabel,
      categories: eventCategories.length,
    };
  };

  const currentEvent = getCurrentEvent();

  if (eventsLoading || categoriesLoading) {
    return (
      <section className="py-16 px-4 lg:px-20">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Current <span className="text-primary">Event</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Loading current event...
          </p>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!currentEvent) {
    return null; // Tidak render section jika tidak ada event
  }

  return (
    <section className="py-16 px-4 lg:px-20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-balance">
          Current <span className="text-primary">Event</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Jump into the live event and support your favorites. Votes update
          instantly.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {currentEvent.status === "live" ? (
                <Badge className="bg-primary text-primary-foreground">
                  Live Now
                </Badge>
              ) : (
                <Badge variant="secondary">{currentEvent.status}</Badge>
              )}
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="w-4 h-4" />
                {currentEvent.endsAtLabel}
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-balance leading-tight">
              {currentEvent.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {currentEvent.categories} categories
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-muted-foreground text-pretty">
            {currentEvent.description}
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/">
                View Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/">
                See Candidates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}