"use client";
import { useState, useMemo } from "react";
import {
  Calendar,
  Users,
  MoreHorizontal,
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Plus,
  Eye,
  Vote,
  UserCheck,
  Trophy,
} from "lucide-react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";
import { useCandidates } from "@/config/hooks/CandidateHook/useCandidate";
import Link from "next/link";

// Helper functions untuk kalkulasi data
const calculateTotalVotes = (candidates: any[]) => {
  return candidates.reduce((total, candidate) => {
    const candidateVotes =
      candidate.votes?.reduce(
        (sum: number, vote: any) => sum + (vote.pointsUsed || 0),
        0
      ) || 0;
    return total + candidateVotes;
  }, 0);
};

const calculateUniqueVoters = (candidates: any[]) => {
  const uniqueUserIds = new Set();
  candidates.forEach((candidate) => {
    candidate.votes?.forEach((vote: any) => {
      uniqueUserIds.add(vote.userId);
    });
  });
  return uniqueUserIds.size;
};

const getCandidateVoteCount = (candidate: any) => {
  return (
    candidate.votes?.reduce(
      (sum: number, vote: any) => sum + (vote.pointsUsed || 0),
      0
    ) || 0
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboardView() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  // Fetch data dari API
  const { data: eventsData } = useEvent().queries.useGetAllEvents();
  const { data: categoriesData } =
    useCategories().queries.useGetAllCategories();
  const { data: candidatesData } =
    useCandidates().queries.useGetAllCandidates();

  // Transform data untuk metrics
  const metricsData = useMemo(() => {
    const totalEvents = eventsData?.length || 0;
    const activeCandidates = candidatesData?.length || 0;
    const totalVotes = calculateTotalVotes(candidatesData || []);
    const activeUsers = calculateUniqueVoters(candidatesData || []);

    return [
      {
        label: "Total Events",
        value: totalEvents.toString(),
        change: "+2",
        trend: "up" as const,
        icon: Calendar,
      },
      {
        label: "Active Candidates",
        value: activeCandidates.toString(),
        change: "+24",
        trend: "up" as const,
        icon: UserCheck,
      },
      {
        label: "Total Votes",
        value: totalVotes.toLocaleString(),
        change: "+1.2k",
        trend: "up" as const,
        icon: Vote,
      },
      {
        label: "Active Users",
        value: activeUsers.toLocaleString(),
        change: "+8.2%",
        trend: "up" as const,
        icon: Users,
      },
    ];
  }, [eventsData, candidatesData]);

  // Transform data untuk events table
  const recentEvents = useMemo(() => {
    if (!eventsData) return [];

    return eventsData.map((event) => {
      const eventCategories =
        categoriesData?.filter((cat) => cat.eventId === event.id) || [];

      const eventCandidates =
        candidatesData?.filter((candidate) =>
          eventCategories.some((cat) => cat.id === candidate.categoryId)
        ) || [];

      const totalVotes = calculateTotalVotes(eventCandidates);
      const totalCandidates = eventCandidates.length;

      return {
        id: event.id,
        name: event.name,
        category: eventCategories[0]?.name || "General",
        candidates: totalCandidates,
        votes: totalVotes,
        status: event.status === "live" ? "active" : "ended",
        endDate: formatDate(event.endDate),
      };
    });
  }, [eventsData, categoriesData, candidatesData]);

  // Transform data untuk top candidates
  const topCandidates = useMemo(() => {
    if (!candidatesData) return [];

    const candidatesWithVotes = candidatesData.map((candidate) => {
      const voteCount = getCandidateVoteCount(candidate);
      const category = categoriesData?.find(
        (cat) => cat.id === candidate.categoryId
      );
      const event = eventsData?.find((ev) => ev.id === category?.eventId);

      return {
        ...candidate,
        voteCount,
        categoryName: category?.name,
        eventName: event?.name,
      };
    });

    // Urutkan berdasarkan jumlah vote tertinggi dan ambil 4 teratas
    return candidatesWithVotes
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 4)
      .map((candidate) => ({
        name: candidate.name,
        event: candidate.eventName || "Unknown Event",
        votes: candidate.voteCount,
        avatar: candidate.photo_url || "/placeholder.svg?height=32&width=32",
        percentage: Math.min(
          100,
          Math.round(
            (candidate.voteCount / (calculateTotalVotes(candidatesData) || 1)) *
              100
          )
        ),
      }));
  }, [candidatesData, categoriesData, eventsData]);

  // Data untuk chart dengan warna yang sesuai theme
  const chartData = [
    { name: "Jan", votes: 4200, users: 1240, events: 8 },
    { name: "Feb", votes: 3800, users: 1398, events: 7 },
    { name: "Mar", votes: 5200, users: 1680, events: 10 },
    { name: "Apr", votes: 4780, users: 1908, events: 9 },
    { name: "May", votes: 6890, users: 2100, events: 11 },
    { name: "Jun", votes: 8390, users: 2341, events: 12 },
  ];

  // Recent activity
  const recentActivity = [
    {
      event: "Best Student Award 2025",
      action: "New vote received",
      time: "2 minutes ago",
    },
    {
      event: "Employee of the Month",
      action: "New candidate added",
      time: "5 minutes ago",
    },
    {
      event: "Community Leader Election",
      action: "Event updated",
      time: "12 minutes ago",
    },
    {
      event: "Best Innovation Project",
      action: "New vote received",
      time: "18 minutes ago",
    },
    {
      event: "Sports Team Captain",
      action: "Event ended",
      time: "32 minutes ago",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Voting Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Monitor your voting events and system performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      {selectedPeriod} <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedPeriod("Last 7 days")}
                    >
                      Last 7 days
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPeriod("Last 30 days")}
                    >
                      Last 30 days
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPeriod("Last 90 days")}
                    >
                      Last 90 days
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/admin/events">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Link href="/admin/events">
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">
                        New Event
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create voting event
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/candidates">
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-card-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">
                        Add Candidate
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Register new candidate
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">
                      View Results
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check event results
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-card-foreground" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-card-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="col-span-2 space-y-8">
              {/* Charts Section */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Voting Analytics
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Track voting trends and user engagement
                      </CardDescription>
                    </div>
                    <Tabs defaultValue="votes" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3 bg-muted">
                        <TabsTrigger
                          value="votes"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Votes
                        </TabsTrigger>
                        <TabsTrigger
                          value="users"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Users
                        </TabsTrigger>
                        <TabsTrigger
                          value="events"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Events
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                        />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            color: "var(--card-foreground)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="votes"
                          stroke="var(--primary)"
                          fill="var(--primary)"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="var(--secondary)"
                          fill="var(--secondary)"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Events Table */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Active Events
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Monitor your voting events and their performance
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableHead className="font-medium text-card-foreground">
                          Event Name
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground">
                          Category
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground">
                          Candidates
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground">
                          Votes
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground">
                          End Date
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground">
                          Status
                        </TableHead>
                        <TableHead className="font-medium text-card-foreground w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEvents.map((event) => (
                        <TableRow
                          key={event.id}
                          className="hover:bg-muted/50 border-border"
                        >
                          <TableCell className="font-medium text-card-foreground">
                            {event.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.category}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.candidates}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.votes.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.endDate}
                          </TableCell>
                          <TableCell>
                            {event.status === "active" && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 border-green-200"
                              >
                                Active
                              </Badge>
                            )}
                            {event.status === "ended" && (
                              <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground border-border"
                              >
                                Ended
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 hover:bg-muted"
                                >
                                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-card border-border"
                              >
                                <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                                  Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                                  View Results
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Top Candidates */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-card-foreground">
                    Top Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {topCandidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 border-b border-border last:border-b-0"
                      >
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarImage
                            src={candidate.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-card-foreground">
                            {candidate.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {candidate.event}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={candidate.percentage}
                              className="h-1.5 flex-1 bg-muted"
                            />
                            <span className="text-xs text-muted-foreground">
                              {candidate.votes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-card-foreground">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 border-b border-border last:border-b-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-card-foreground truncate">
                            {activity.event}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activity.action} • {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}