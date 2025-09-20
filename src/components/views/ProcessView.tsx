"use client";
import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Clock,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Store,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PaymentData {
  orderId: string;
  paymentCode: string;
  amount: number;
  method: string;
  methodName: string;
  expiryTime: number;
}

export default function ProcessView() {
  const [paymentData] = useState<PaymentData>({
    orderId: "VP-2024-091301",
    paymentCode: "8012345678901234",
    amount: 45000,
    method: "indomaret",
    methodName: "Indomaret",
    expiryTime: Date.now() + 24 * 60 * 60 * 1000,
  });

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "checking" | "success" | "expired"
  >("pending");
  const [progress, setProgress] = useState(33);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const difference = paymentData.expiryTime - now;

      if (difference > 0) {
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });

        // Update progress bar
        const totalTime = 24 * 60 * 60 * 1000;
        const elapsed = totalTime - difference;
        const progressValue = Math.min(100, (elapsed / totalTime) * 100);
        setProgress(progressValue);
      } else {
        setPaymentStatus("expired");
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData.expiryTime]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const checkPaymentStatus = () => {
    setPaymentStatus("checking");
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus("pending");
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  const formatTime = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const PaymentMethodIcon = ({ method }: { method: string }) => {
    const iconClasses = "w-10 h-10 rounded-lg flex items-center justify-center";

    switch (method) {
      case "indomaret":
        return (
          <div className={`${iconClasses} bg-[#EE7600]`}>
            <Store className="w-6 h-6 text-white" />
          </div>
        );
      case "bca":
        return (
          <div className={`${iconClasses} bg-blue-600`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        );
      case "mandiri":
        return (
          <div className={`${iconClasses} bg-blue-800`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        );
      case "bri":
        return (
          <div className={`${iconClasses} bg-blue-900`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        );
      case "gopay":
        return (
          <div className={`${iconClasses} bg-green-600`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        );
      case "ovo":
        return (
          <div className={`${iconClasses} bg-purple-600`}>
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} bg-primary`}>
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
        );
    }
  };

  const getPaymentInstructions = () => {
    switch (paymentData.method) {
      case "indomaret":
        return [
          "Kunjungi gerai Indomaret terdekat",
          "Berikan kode pembayaran kepada kasir",
          "Lakukan pembayaran sesuai nominal",
          "Simpan struk pembayaran sebagai bukti",
        ];
      case "bca":
      case "mandiri":
      case "bri":
        return [
          "Login ke mobile banking atau ATM",
          "Pilih menu Transfer/Bayar",
          "Pilih Virtual Account",
          "Masukkan nomor Virtual Account",
          "Konfirmasi pembayaran dan simpan bukti transfer",
        ];
      case "gopay":
      case "ovo":
        return [
          "Buka aplikasi e-wallet Anda",
          "Pilih menu Bayar/Transfer",
          "Scan QR code atau masukkan kode pembayaran",
          "Konfirmasi pembayaran",
          "Simpan bukti pembayaran",
        ];
      default:
        return ["Ikuti instruksi pembayaran yang tersedia"];
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen py-28 bg-card flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 lg:p-8 w-full">
          <div className="text-center p-8 bg-background rounded-xl shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Pembayaran Berhasil!
            </h1>
            <p className="text-muted-foreground mb-8">
              Vote points telah ditambahkan ke akun Anda
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "expired") {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 lg:p-8 w-full">
          <div className="text-center p-8 bg-background rounded-xl shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Pembayaran Kedaluwarsa
            </h1>
            <p className="text-muted-foreground mb-8">
              Waktu pembayaran telah habis. Silakan buat pesanan baru.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              Buat Pesanan Baru
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8 p-4 bg-card rounded-lg shadow-sm">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pembayaran</h1>
            <p className="text-muted-foreground">
              Selesaikan pembayaran untuk mendapatkan vote points
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert */}
            <Alert className="border-[#FFE8CC] bg-[#FFF5E8]">
              <Clock className="w-4 h-4 text-[#D56E00]" />
              <AlertDescription className="text-[#8C4900] font-medium">
                Selesaikan pembayaran sebelum waktu habis untuk mendapatkan vote
                points Anda
              </AlertDescription>
            </Alert>

            {/* Progress Bar */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">
                    Progress Pembayaran
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Dimulai</span>
                  <span>Batas Waktu</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Receipt className="w-5 h-5" />
                  Detail Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order ID */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Order ID
                    </div>
                    <div className="font-semibold text-foreground">
                      {paymentData.orderId}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(paymentData.orderId, "orderId")
                    }
                    className="h-8"
                  >
                    {copiedField === "orderId" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Payment Code */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {paymentData.method === "indomaret"
                        ? "Kode Pembayaran"
                        : "Virtual Account"}
                    </div>
                    <div className="font-semibold text-lg text-foreground">
                      {paymentData.paymentCode}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(paymentData.paymentCode, "paymentCode")
                    }
                    className="h-8"
                  >
                    {copiedField === "paymentCode" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Payment Amount */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Pembayaran
                    </div>
                    <div className="font-bold text-lg text-foreground">
                      {formatCurrency(paymentData.amount)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(paymentData.amount.toString(), "amount")
                    }
                    className="h-8"
                  >
                    {copiedField === "amount" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="w-5 h-5" />
                  Cara Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {getPaymentInstructions().map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm lg:text-base text-foreground">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Payment Method Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <PaymentMethodIcon method={paymentData.method} />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Metode Pembayaran
                      </p>
                      <h3 className="font-semibold text-foreground">
                        {paymentData.methodName}
                      </h3>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-secondary text-secondary-foreground"
                  >
                    Menunggu
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Countdown Timer */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-4">
                  Waktu Tersisa
                </h2>
                <div className="flex justify-center gap-4 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[4rem]">
                    <div className="text-2xl lg:text-3xl font-bold">
                      {formatTime(timeLeft.hours)}
                    </div>
                    <div className="text-xs lg:text-sm">Jam</div>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[4rem]">
                    <div className="text-2xl lg:text-3xl font-bold">
                      {formatTime(timeLeft.minutes)}
                    </div>
                    <div className="text-xs lg:text-sm">Menit</div>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[4rem]">
                    <div className="text-2xl lg:text-3xl font-bold">
                      {formatTime(timeLeft.seconds)}
                    </div>
                    <div className="text-xs lg:text-sm">Detik</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mohon Untuk Melakukan Pembayaran Sebelum Waktu Habis
                </p>
              </CardContent>
            </Card>

            {/* Check Payment Status */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">
                  Sudah Bayar?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Klik tombol di bawah untuk mengecek status pembayaran Anda
                </p>
                <Button
                  onClick={checkPaymentStatus}
                  disabled={paymentStatus === "checking"}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full px-8 py-3"
                >
                  {paymentStatus === "checking" ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Mengecek Status...
                    </>
                  ) : (
                    "Cek Status Pembayaran"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
