"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePointVotes } from "@/config/hooks/PointVotesHook/usePointVotes";
import { USER_QUERY_KEYS } from "@/config/hooks/UsersHook/usersQueryKey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowLeft, Clock } from "lucide-react";

// Callback Duitku bisa datang beberapa detik setelah user di-redirect,
// jadi status "pending" di-polling sebentar sebelum menyerah.
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 60_000;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { queries } = usePointVotes();

  const merchantOrderId = searchParams.get("merchantOrderId") ?? "";
  const referenceParam = searchParams.get("reference");

  const [pollTimedOut, setPollTimedOut] = useState(false);

  const {
    data: pointVoteData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = queries.useGetPointVoteMerchantOrderId(merchantOrderId, {
    refetchInterval: (query) =>
      query.state.data?.payment_status === "pending" && !pollTimedOut
        ? POLL_INTERVAL_MS
        : false,
  });

  // Status selalu diambil dari DB (diupdate oleh callback Duitku),
  // bukan dari resultCode di URL yang bisa dimanipulasi user.
  const paymentStatus = pointVoteData?.payment_status;

  // Hentikan polling setelah 60 detik bila status masih pending.
  useEffect(() => {
    if (paymentStatus !== "pending" || pollTimedOut) return;

    const timer = setTimeout(() => setPollTimedOut(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [paymentStatus, pollTimedOut]);

  // Setelah sukses, refresh data user supaya "Points" di navbar ter-update.
  const userQueriesInvalidated = useRef(false);
  useEffect(() => {
    if (paymentStatus === "success" && !userQueriesInvalidated.current) {
      userQueriesInvalidated.current = true;
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    }
  }, [paymentStatus, queryClient]);

  const handleCheckAgain = () => {
    setPollTimedOut(false);
    refetch();
  };

  if (!merchantOrderId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Transaksi Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Link pembayaran tidak lengkap (Order ID tidak ada). Jika Anda
              sudah membayar, poin akan otomatis masuk ke akun Anda setelah
              pembayaran dikonfirmasi.
            </p>
            <Button onClick={() => router.push("/points")} className="mt-4">
              Ke Halaman Points
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-lg">Memverifikasi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (isError || !pointVoteData) {
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
            <div className="flex flex-wrap gap-4 mt-4">
              <Button onClick={() => refetch()} disabled={isFetching}>
                Coba Lagi
              </Button>
              <Button variant="outline" onClick={() => router.push("/points")}>
                Ke Halaman Points
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reference = pointVoteData?.reference ?? referenceParam ?? "-";

  const orderInfo = (
    <>
      <div>
        <p className="text-sm text-muted-foreground">Order ID</p>
        <p className="font-semibold break-all">{merchantOrderId}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Reference</p>
        <p className="font-semibold break-all">{reference}</p>
      </div>
    </>
  );

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
              {orderInfo}
              <div>
                <p className="text-sm text-muted-foreground">
                  Points Ditambahkan
                </p>
                <p className="font-semibold">
                  {pointVoteData?.points ?? 0} points
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Pembayaran
                </p>
                <p className="font-semibold">
                  {formatPrice(pointVoteData?.amount ?? 0)}
                </p>
              </div>
              {/* Tampilkan nama package jika ada, jika tidak tampilkan "Custom Points" */}
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-semibold">
                  {pointVoteData?.package?.name ?? "Custom Points Purchase"}
                </p>
              </div>
            </div>

            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 text-sm">
                Points telah berhasil ditambahkan ke akun Anda. Anda dapat
                menggunakan points tersebut untuk voting.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => router.push("/points")}>
                Lihat Points Saya
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : paymentStatus === "pending" ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              {pollTimedOut ? (
                <Clock className="w-6 h-6" />
              ) : (
                <Loader2 className="w-6 h-6 animate-spin" />
              )}
              Menunggu Konfirmasi Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">{orderInfo}</div>

            <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                {pollTimedOut
                  ? "Konfirmasi pembayaran belum kami terima. Jika Anda sudah membayar, points akan otomatis ditambahkan setelah pembayaran dikonfirmasi. Silakan cek kembali beberapa saat lagi."
                  : "Kami sedang menunggu konfirmasi dari payment gateway. Halaman ini akan diperbarui otomatis."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {pollTimedOut && (
                <Button onClick={handleCheckAgain} disabled={isFetching}>
                  {isFetching && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Cek Status Lagi
                </Button>
              )}
              <Button
                variant={pollTimedOut ? "outline" : "default"}
                onClick={() => router.push("/points")}
              >
                Lihat Points Saya
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
            <div className="grid grid-cols-2 gap-4">{orderInfo}</div>

            <div className="bg-red-100 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Maaf, pembayaran Anda gagal diproses. Silakan coba lagi atau
                hubungi customer service jika masalah berlanjut.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => router.push("/points")}>Coba Lagi</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
