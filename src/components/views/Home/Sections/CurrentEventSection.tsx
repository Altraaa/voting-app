"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ArrowRight, Trophy, Users, Clock } from "lucide-react";
import Link from "next/link";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

      let endsAtLabel = "Sedang Berlangsung";
      const apiStatus = event.status?.toLowerCase() as
        | "live"
        | "upcoming"
        | "ended";

      if (apiStatus === "upcoming" && startsAt) {
        endsAtLabel = `Dimulai ${startsAt.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
      } else if (endsAt && apiStatus === "live") {
        endsAtLabel = `Berakhir ${endsAt.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
      } else if (endsAt && apiStatus === "ended") {
        endsAtLabel = `Berakhir ${endsAt.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
      }

      return {
        id: event.id,
        title: event.name || "Acara Saat Ini",
        description:
          event.description ||
          "Ikuti acara voting saat ini dan dukung favorit Anda.",
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
            Acara <span className="text-primary">Saat Ini</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Memuat acara terkini...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48">
                <Skeleton className="h-full w-full" />
                <div className="absolute top-4 left-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
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

  // Komponen untuk card landscape (hanya untuk 1 event)
  const LandscapeEventCard = ({ event }: { event: EventInfo }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto">
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
                🔴 Langsung
              </Badge>
            ) : event.status === "upcoming" ? (
              <Badge variant="secondary">
                <CalendarClock className="w-3 h-3 mr-1" />
                Akan Datang
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-500 text-white">
                Selesai
              </Badge>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {event.status === "live" ? (
                <Badge className="bg-red-500 text-white border-red-600 animate-pulse">
                  🔴 Langsung
                </Badge>
              ) : event.status === "upcoming" ? (
                <Badge variant="secondary">
                  <CalendarClock className="w-3 h-3 mr-1" />
                  Akan Datang
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-500 text-white">
                  Selesai
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl font-bold mb-3 line-clamp-2">
              {event.title}
            </CardTitle>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {event.description}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {event.categories} kategori
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {event.endsAtLabel}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.participants || 0} peserta
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href={`/event/${event.id}/category`}>
                {event.status === "live"
                  ? "Vote Sekarang"
                  : event.status === "upcoming"
                  ? "Lihat Detail"
                  : "Lihat Hasil"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Komponen untuk card portrait (untuk multiple events)
  const PortraitEventCard = ({
    event,
    featured = false,
  }: {
    event: EventInfo;
    featured?: boolean;
  }) => (
    <Card
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
              🔴 Langsung
            </Badge>
          ) : event.status === "upcoming" ? (
            <Badge variant="secondary">
              <CalendarClock className="w-3 h-3 mr-1" />
              Akan Datang
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-500 text-white">
              Selesai
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
              {event.categories} kategori
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
            {event.participants || 0} peserta
          </div>
          <div className="text-xs bg-muted px-2 py-1 rounded-full">
            {event.categories} kategori
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size={featured ? "lg" : "default"}>
            <Link href={`/event/${event.id}/category`}>
              {event.status === "live"
                ? "Vote Sekarang"
                : event.status === "upcoming"
                ? "Lihat Detail"
                : "Lihat Hasil"}
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
            ? "Acara Langsung & Akan Datang"
            : "Acara Akan Datang"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          {currentEvents.some((e) => e.status === "live")
            ? "Ikuti acara langsung dan dukung favorit Anda. Pembaruan voting instan."
            : "Bersiaplah untuk acara-acara menarik yang akan datang. Tandai kalender Anda!"}
        </p>
      </div>

      {/* Events Grid - Different layouts based on count */}
      {currentEvents.length === 1 && (
        // Single Event - Full Width Landscape
        <div className="max-w-5xl mx-auto mb-8">
          <LandscapeEventCard event={currentEvents[0]} />
        </div>
      )}

      {currentEvents.length === 2 && (
        // Two Events - Side by Side on Desktop
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {currentEvents.map((event) => (
            <PortraitEventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {currentEvents.length === 3 && (
        // Three Events - Featured + Two Smaller
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEvents.map((event, index) => (
            <PortraitEventCard
              key={event.id}
              event={event}
              featured={index === 0}
            />
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/event">
            Lihat Semua Acara
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}