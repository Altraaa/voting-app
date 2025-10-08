"use client";
import { useState, useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Filter,
  Eye,
  ChevronDown,
  Package,
  Users,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePackageHistory } from "@/config/hooks/PackageHistoryHook/usePackageHistory";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AdminPackageHistoryView() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  // Fetch data dari API
  const { data: packageHistoryData } =
    usePackageHistory().queries.useGetAllPackageHistories();

  // Transform data untuk metrics
  const metricsData = useMemo(() => {
    if (!packageHistoryData) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        totalPoints: 0,
        activeSubscriptions: 0,
        popularPackage: { name: "-", count: 0 },
        totalUsers: 0,
      };
    }

    const transactions = packageHistoryData;
    const totalRevenue = transactions.reduce(
      (sum, item) => sum + (item.package?.price || 0),
      0
    );
    const totalTransactions = transactions.length;
    const totalPoints = transactions.reduce(
      (sum, item) => sum + (item.pointsReceived || 0),
      0
    );
    const activeSubscriptions = transactions.filter(
      (item) => item.isActive
    ).length;

    // Hitung paket terpopuler
    const packageCount = transactions.reduce((acc, item) => {
      const packageName = item.package?.name || "Unknown";
      acc[packageName] = (acc[packageName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularPackage = Object.entries(packageCount).reduce(
      (max, [name, count]) => (count > max.count ? { name, count } : max),
      { name: "-", count: 0 }
    );

    // Hitung jumlah unique users
    const uniqueUsers = new Set(transactions.map((item) => item.userId));
    const totalUsers = uniqueUsers.size;

    return {
      totalRevenue,
      totalTransactions,
      totalPoints,
      activeSubscriptions,
      popularPackage,
      totalUsers,
    };
  }, [packageHistoryData]);

  const metrics = [
    {
      label: "Revenue",
      value: formatCurrency(metricsData.totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Total Transaction",
      value: metricsData.totalTransactions.toString(),
      change: "+8",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      label: "Total Points Sold",
      value: metricsData.totalPoints.toLocaleString(),
      change: "+15",
      trend: "up",
      icon: Package,
    },
    {
      label: "Active Subscribers",
      value: metricsData.activeSubscriptions.toString(),
      change: "+5",
      trend: "up",
      icon: Users,
    },
  ];

  // Transform data untuk tabel
  const historyData = useMemo(() => {
    if (!packageHistoryData) return [];

    return packageHistoryData.map((item) => ({
      id: item.id,
      userName: item.user?.name || "Unknown User",
      userEmail: item.user?.email || "-",
      packageName: item.package?.name || "Unknown Package",
      packagePrice: item.package?.price || 0,
      pointsReceived: item.pointsReceived || 0,
      purchaseDate: formatDate(item.purchaseDate),
      validUntil: item.validUntil ? formatDate(item.validUntil) : "-",
      isActive: item.isActive,
    }));
  }, [packageHistoryData]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Package History
                </h1>
                <p className="text-muted-foreground mt-1">
                  Monitor package payments and transaction performance
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
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-6 hover:shadow-md transition-shadow border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">
                      Revenue Growth
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      +12.5% dari bulan lalu
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-card-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">
                      Most Pupular Package
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {metricsData.popularPackage.name} (
                      {metricsData.popularPackage.count}x sold)
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">
                      Avg. Transaction
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {metricsData.totalTransactions > 0
                        ? formatCurrency(
                            metricsData.totalRevenue /
                              metricsData.totalTransactions
                          )
                        : formatCurrency(0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
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
                      <TrendingUp
                        className={`w-3 h-3 ${
                          metric.trend === "down" ? "rotate-180" : ""
                        }`}
                      />
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

          {/* Transaction History Table */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-card-foreground">
                    Transaction History
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Complete list of package payments from users
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="font-medium text-card-foreground">
                      User
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground">
                      Email
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground">
                      Package
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground">
                      Points
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground">
                      Purchase Date
                    </TableHead>
                    <TableHead className="font-medium text-card-foreground w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground py-8"
                      >
                        No Package History Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    historyData.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 border-border"
                      >
                        <TableCell className="font-medium text-card-foreground">
                          {item.userName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.userEmail}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.packageName}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {formatCurrency(item.packagePrice)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                            {item.pointsReceived} pts
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.purchaseDate}
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
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                                Refund
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}