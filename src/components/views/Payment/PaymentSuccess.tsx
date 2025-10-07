"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePointVotes } from "@/config/hooks/PointVotesHook/usePointVotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { queries } = usePointVotes();

  const merchantOrderId = searchParams.get("merchantOrderId");
  const resultCode = searchParams.get("resultCode");
  const reference = searchParams.get("reference");

  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");

  const { 
    data: pointVoteData, 
    isLoading, 
    error,
    refetch 
  } = queries.useGetPointVoteMerchantId(merchantOrderId || "");
  console.log(pointVoteData)


  useEffect(() => {
    if (resultCode === "00") {
      setPaymentStatus("success");
    } else {
      setPaymentStatus("failed");
    }

    if (merchantOrderId) {
      refetch();
    }

    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [merchantOrderId, resultCode, refetch]);

  if (isProcessing || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg">Memverifikasi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Terjadi Kesalahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gagal memuat data transaksi. Silakan coba lagi.</p>
            <Button 
              onClick={() => refetch()} 
              className="mt-4"
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/points")} 
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Points
      </Button>

      {paymentStatus === "success" ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Pembayaran Berhasil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold">{merchantOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-semibold">{reference}</p>
              </div>
              {pointVoteData && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Ditambahkan</p>
                    <p className="font-semibold">{pointVoteData.points} points</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(pointVoteData.amount)}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 text-sm">
                Points telah berhasil ditambahkan ke akun Anda. Anda dapat menggunakan points tersebut untuk voting.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => router.push("/points")}>
                Lihat Points Saya
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Pembayaran Gagal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold">{merchantOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-semibold">{reference}</p>
              </div>
            </div>
            
            <div className="bg-red-100 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Maaf, pembayaran Anda gagal diproses. Silakan coba lagi atau hubungi customer service jika masalah berlanjut.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => router.push("/points")}>
                Coba Lagi
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}