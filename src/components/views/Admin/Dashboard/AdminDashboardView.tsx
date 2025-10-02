"use client";
import { useState } from "react";
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

const metricsData = [
  {
    label: "Total Events",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Calendar,
  },
  {
    label: "Active Candidates",
    value: "156",
    change: "+24",
    trend: "up",
    icon: UserCheck,
  },
  {
    label: "Total Votes",
    value: "8,423",
    change: "+1.2k",
    trend: "up",
    icon: Vote,
  },
  {
    label: "Active Users",
    value: "2,341",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
];

const recentEvents = [
  {
    id: 1,
    name: "Best Student Award 2025",
    category: "Academic",
    candidates: 24,
    votes: 1245,
    status: "active",
    endDate: "25 Jun 2025",
  },
  {
    id: 2,
    name: "Employee of the Month",
    category: "Corporate",
    candidates: 12,
    votes: 856,
    status: "active",
    endDate: "30 Jun 2025",
  },
  {
    id: 3,
    name: "Community Leader Election",
    category: "Community",
    candidates: 8,
    votes: 2341,
    status: "active",
    endDate: "15 Jul 2025",
  },
  {
    id: 4,
    name: "Best Innovation Project",
    category: "Technology",
    candidates: 18,
    votes: 678,
    status: "active",
    endDate: "20 Jun 2025",
  },
  {
    id: 5,
    name: "Sports Team Captain",
    category: "Sports",
    candidates: 6,
    votes: 423,
    status: "ended",
    endDate: "18 Jun 2025",
  },
];

const chartData = [
  { name: "Jan", votes: 4200, users: 1240, events: 8 },
  { name: "Feb", votes: 3800, users: 1398, events: 7 },
  { name: "Mar", votes: 5200, users: 1680, events: 10 },
  { name: "Apr", votes: 4780, users: 1908, events: 9 },
  { name: "May", votes: 6890, users: 2100, events: 11 },
  { name: "Jun", votes: 8390, users: 2341, events: 12 },
];

const topCandidates = [
  {
    name: "Sarah Johnson",
    event: "Best Student Award 2025",
    votes: 342,
    avatar: "/placeholder.svg?height=32&width=32",
    percentage: 27,
  },
  {
    name: "Michael Chen",
    event: "Employee of the Month",
    votes: 298,
    avatar: "/placeholder.svg?height=32&width=32",
    percentage: 35,
  },
  {
    name: "Emma Williams",
    event: "Community Leader Election",
    votes: 567,
    avatar: "/placeholder.svg?height=32&width=32",
    percentage: 24,
  },
  {
    name: "David Brown",
    event: "Best Innovation Project",
    votes: 234,
    avatar: "/placeholder.svg?height=32&width=32",
    percentage: 35,
  },
];

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

export default function AdminDashboardView() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          {/* Quick Actions Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Voting Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor your voting events and system performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
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
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">New Event</h3>
                    <p className="text-sm text-gray-600">Create voting event</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Add Candidate</h3>
                    <p className="text-sm text-gray-600">
                      Register new candidate
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">View Results</h3>
                    <p className="text-sm text-gray-600">Check event results</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-gray-600" />
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
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="col-span-2 space-y-8">
              {/* Charts Section */}
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Voting Analytics
                      </CardTitle>
                      <CardDescription>
                        Track voting trends and user engagement
                      </CardDescription>
                    </div>
                    <Tabs defaultValue="votes" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="votes">Votes</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="votes"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Events Table */}
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Active Events
                      </CardTitle>
                      <CardDescription>
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
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-gray-700">
                          Event Name
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          Category
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          Candidates
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          Votes
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          End Date
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="font-medium text-gray-700 w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEvents.map((event) => (
                        <TableRow key={event.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {event.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {event.category}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {event.candidates}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {event.votes.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {event.endDate}
                          </TableCell>
                          <TableCell>
                            {event.status === "active" && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700"
                              >
                                Active
                              </Badge>
                            )}
                            {event.status === "ended" && (
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-700"
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
                                  className="w-8 h-8"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Results
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
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
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Top Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {topCandidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={candidate.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">
                            {candidate.name}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {candidate.event}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={candidate.percentage}
                              className="h-1.5 flex-1"
                            />
                            <span className="text-xs text-gray-600">
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
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {activity.event}
                          </div>
                          <div className="text-xs text-gray-600">
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
