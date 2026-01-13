"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/config/hooks/SettingsHook/useSettings";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const { queries, mutations } = useSettings();
  const { data: settings, isLoading } = queries.useGetSettings();

  const handleToggleTotalVotes = async (checked: boolean) => {
    try {
      await mutations.updateMutation.mutateAsync({
        showTotalVotes: checked,
      });
      toast.success(
        checked
          ? "Total votes sekarang ditampilkan di halaman publik"
          : "Total votes sekarang disembunyikan di halaman publik"
      );
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Gagal mengubah pengaturan");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Pengaturan</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola pengaturan aplikasi voting
        </p>
      </div>

      {/* Display Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings?.showTotalVotes ? (
              <Eye className="h-5 w-5 text-primary" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
            Pengaturan Tampilan
          </CardTitle>
          <CardDescription>
            Atur apa yang ditampilkan di halaman publik
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle Total Votes */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="show-total-votes" className="text-base font-medium">
                Tampilkan Total Votes
              </Label>
              <p className="text-sm text-muted-foreground">
                Menampilkan jumlah total suara di halaman leaderboard dan detail kategori
              </p>
            </div>
            <Switch
              id="show-total-votes"
              checked={settings?.showTotalVotes ?? true}
              onCheckedChange={handleToggleTotalVotes}
              disabled={mutations.updateMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}