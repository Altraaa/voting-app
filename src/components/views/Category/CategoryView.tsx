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
      {/* Event Header Section */}
      <div className="mb-12">
        <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-6">
          <Image
            src={event.photo_url || "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-3">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              {event.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {event.description}
            </p>
          </div>
        </div>

        {/* Event Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={category.photo_url || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary">{mapStatus(event.status)}</Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg text-balance leading-tight">
                {category.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground text-pretty">
                Vote for your favorite in this category
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {category._count.candidates} Candidates
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Ends {formatDate(event.endDate)}
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/event/${eventId}/category/${category.id}`}>
                  View & Vote
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
