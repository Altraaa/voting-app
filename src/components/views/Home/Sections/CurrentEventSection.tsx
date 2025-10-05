"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ArrowRight, Trophy, Users, Clock } from "lucide-react";
import Link from "next/link";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import Image from "next/image";

type EventInfo = {
  id: string;
  title: string;
  description: string;
  status: "live" | "upcoming" | "ended";
  endsAtLabel: string;
  categories: number;
  image?: string;
  startDate?: string;
  participants?: number;
};

export default function CurrentEventSection() {
  const { queries: eventQueries } = useEvent();
  const { data: events = [], isLoading: eventsLoading } =
    eventQueries.useGetAllEvents();

  const getCurrentEvents = (): EventInfo[] => {
    if (eventsLoading || events.length === 0) {
      return [];
    }

    const sortedEvents = events
      .filter((event) => {
        const status = event.status?.toLowerCase();
        return status === "live" || status === "upcoming";
      })
      .sort((a, b) => {
        const aStatus = a.status?.toLowerCase();
        const bStatus = b.status?.toLowerCase();

        if (aStatus === "live" && bStatus !== "live") return -1;
        if (bStatus === "live" && aStatus !== "live") return 1;

        const aDate = new Date(a.startDate || 0);
        const bDate = new Date(b.startDate || 0);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 3);
      
    return sortedEvents.map((event) => {
      const eventCategories = event.categories || [];

      const endsAt = event.endDate ? new Date(event.endDate) : null;
      const startsAt = event.startDate ? new Date(event.startDate) : null;

      let endsAtLabel = "Ongoing";
      const apiStatus = event.status?.toLowerCase() as
        | "live"
        | "upcoming"
        | "ended";

      if (apiStatus === "upcoming" && startsAt) {
        endsAtLabel = `Starts ${startsAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      } else if (endsAt && apiStatus === "live") {
        endsAtLabel = `Ends ${endsAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      } else if (endsAt && apiStatus === "ended") {
        endsAtLabel = `Ended ${endsAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }

      return {
        id: event.id,
        title: event.name || "Current Event",
        description:
          event.description ||
          "Join the current voting event and support your favorites.",
        status: apiStatus || "upcoming",
        endsAtLabel,
        categories: eventCategories.length,
        image: event.photo_url,
        startDate: event.startDate,
        participants: event.users?.length || 0,
      };
    });
  };

  const currentEvents = getCurrentEvents();

  if (eventsLoading) {
    return (
      <section className="py-16 px-4 lg:px-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Current <span className="text-primary">Events</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Loading current events...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-2/3"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (currentEvents.length === 0) {
    return null;
  }

  const renderEventCard = (event: EventInfo, featured: boolean = false) => (
    <Card
      key={event.id}
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group ${
        featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      {/* Event Image */}
      <div className={`relative ${featured ? "h-80" : "h-48"} overflow-hidden`}>
        <Image
          src={event.image || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {event.status === "live" ? (
            <Badge className="bg-red-500 text-white border-red-600 animate-pulse">
              🔴 Live Now
            </Badge>
          ) : event.status === "upcoming" ? (
            <Badge variant="secondary">
              <CalendarClock className="w-3 h-3 mr-1" />
              Upcoming
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-500 text-white">
              Ended
            </Badge>
          )}
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <CardTitle
            className={`${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            } font-bold text-white mb-2 line-clamp-2`}
          >
            {event.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {event.categories} categories
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.endsAtLabel}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Description */}
        <p
          className={`text-muted-foreground text-sm mb-4 ${
            featured ? "line-clamp-3" : "line-clamp-2"
          }`}
        >
          {event.description}
        </p>

        {/* Additional Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {event.participants || 0} participants
          </div>
          <div className="text-xs bg-muted px-2 py-1 rounded-full">
            {event.categories} categories
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size={featured ? "lg" : "default"}>
            <Link href={`/event/${event.id}/category`}>
              {event.status === "live"
                ? "Vote Now"
                : event.status === "upcoming"
                ? "View Details"
                : "View Results"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 px-4 lg:px-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-balance">
          {currentEvents.some((e) => e.status === "live")
            ? "Live & Upcoming Events"
            : "Upcoming Events"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          {currentEvents.some((e) => e.status === "live")
            ? "Jump into live events and support your favorites. Votes update instantly."
            : "Get ready for these exciting upcoming events. Mark your calendar!"}
        </p>
      </div>

      {/* Events Grid - Different layouts based on count */}
      {currentEvents.length === 1 && (
        // Single Event - Full Width Featured
        <div className="max-w-4xl mx-auto mb-8">
          {renderEventCard(currentEvents[0], true)}
        </div>
      )}

      {currentEvents.length === 2 && (
        // Two Events - Side by Side on Desktop
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {currentEvents.map((event) => renderEventCard(event, false))}
        </div>
      )}

      {currentEvents.length === 3 && (
        // Three Events - Featured + Two Smaller
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEvents.map((event, index) =>
            renderEventCard(event, index === 0)
          )}
        </div>
      )}

      {/* View All Button */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/event">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
