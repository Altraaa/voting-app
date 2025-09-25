import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ArrowRight, Users, Trophy } from "lucide-react";
import Link from "next/link";

type EventInfo = {
  id: string;
  title: string;
  description: string;
  status: "Live" | "Upcoming" | "Ended";
  endsAtLabel: string;
  participants: number;
  categories: number;
};

const currentEvent: EventInfo = {
  id: "indo-music-awards-2025",
  title: "Indo Music Awards 2025",
  description:
    "Vote for your favorite artists across categories like Best Singer, Best Band, and Rising Star. Real-time results, secure, and transparent.",
  status: "Live",
  endsAtLabel: "Ends Sep 30, 2025",
  participants: 24,
  categories: 6,
};

export default function CurrentEventSection() {
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
              {currentEvent.status === "Live" ? (
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
              <Users className="w-4 h-4" />
              {currentEvent.participants} participants
            </div>
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