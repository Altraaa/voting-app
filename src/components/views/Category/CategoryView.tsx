"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, TrendingUp, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { StatusEvent } from "@/generated/prisma";
import { useEventQueries } from "@/config/hooks/EventHook/eventQueries";

const mapStatus = (status: StatusEvent): string => {
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

export default function CategoryView() {
  const params = useParams();
  const eventId = params.id as string;

  // Fetch data event berdasarkan ID
  const {
    data: eventData,
    isLoading,
    error,
  } = useEventQueries.useGetEventById(eventId);

  if (isLoading) {
    return (
      <div className="px-4 lg:px-20 py-32">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-20 py-32">
        <div className="text-center text-red-500">
          Error loading event: something went wrong
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="px-4 lg:px-20 py-32">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  const event = eventData;

  return (
    <div className="px-4 lg:px-20 py-32">
      {/* Event Header Section dengan layout flex untuk desktop */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Event Image - Rasio 4:5 untuk semua layar */}
          <div className="lg:w-2/5">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <Image
                src={event.photo_url || "/placeholder.svg"}
                alt={event.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Status Badge untuk mobile */}
              <div className="absolute top-4 left-4 lg:hidden">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {mapStatus(event.status)}
                  </Badge>
                  {event.status === "live" && (
                    <Badge className="bg-green-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Live Now
                    </Badge>
                  )}
                </div>
              </div>

              {/* Event Info Overlay untuk mobile */}
              <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                  {event.name}
                </h1>
                <p className="text-sm text-white/90 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Event Content untuk desktop */}
          <div className="lg:w-3/5 flex flex-col justify-center">
            {/* Status Badge untuk desktop */}
            <div className="hidden lg:flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                {mapStatus(event.status)}
              </Badge>
              {event.status === "live" && (
                <Badge className="bg-green-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Now
                </Badge>
              )}
            </div>

            {/* Event Title & Description untuk desktop */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {event.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {event.description}
              </p>
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">{formatDate(event.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">{formatDate(event.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="font-semibold">
                    {event.categories?.length || 0} Categories
                  </p>
                </div>
              </div>
            </div>

            {/* Event Title & Description untuk mobile (di bawah info) */}
            <div className="lg:hidden mt-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                {event.name}
              </h1>
              <p className="text-muted-foreground">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-balance">
          Voting <span className="text-primary">Categories</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Explore all available voting categories in this event. Cast your votes
          and see real-time results.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {event.categories?.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Category Image dengan rasio 4:5 */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={category.photo_url || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary">{mapStatus(event.status)}</Badge>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Category Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {category.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {category._count.candidates} Kandidat
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                Vote for your favorite in this category
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Berakhir {formatDate(event.endDate)}
                </div>
              </div>

              <Button asChild className="w-full" size="sm">
                <Link href={`/event/${eventId}/category/${category.id}`}>
                  Lihat & Vote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!event.categories || event.categories.length === 0) && (
        <div className="text-center py-20 text-muted-foreground">
          No categories available for this event yet.
        </div>
      )}
    </div>
  );
}