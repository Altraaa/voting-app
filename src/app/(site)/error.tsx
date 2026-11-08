"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Site error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Terjadi Kesalahan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Maaf, halaman ini gagal dimuat. Silakan muat ulang halaman. Jika
            masalah berlanjut, matikan fitur terjemahan otomatis di browser
            Anda.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => reset()}>Muat Ulang</Button>
            <Button variant="outline" asChild>
              <Link href="/">Ke Beranda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
