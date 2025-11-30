"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthUser } from "@/config/hooks/useAuthUser";
import { usePackage } from "@/config/hooks/PackageHook/usePackage";
import { usePaymentMethods } from "@/config/hooks/usePaymentMethods";
import { PaymentStatus } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { usePurchasePoints } from "@/config/hooks/PointVotesHook/usePurchasePoint";
import Image from "next/image";
import { generateMerchantOrderId } from "@/config/utils/merchant";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthUser();
  const { purchaseAndPay, isProcessing } = usePurchasePoints();

  const packageId = searchParams.get("packageId");
  const amount = searchParams.get("amount");
  const points = searchParams.get("points");

  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { queries: packageQueries } = usePackage();
  const { data: packages = [] } = packageQueries.useGetAllPackages();

  const isCustomPurchase = !packageId;

  // Validasi parameter URL
  useEffect(() => {
    const validateParams = () => {
      try {
        const pointsNum = points ? parseInt(points) : 0;
        const amountNum = amount ? parseInt(amount) : 0;

        if (
          isNaN(pointsNum) ||
          isNaN(amountNum) ||
          pointsNum < 10 ||
          amountNum < 10000
        ) {
          throw new Error(
            "Invalid points or amount. Minimum purchase is 10 points (Rp 10,000)"
          );
        }

        if (!isCustomPurchase && !packageId) {
          throw new Error("Invalid package selected");
        }

        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    validateParams();
  }, [packageId, points, amount, isCustomPurchase]);

  const {
    data: paymentMethodsData,
    isLoading: loadingMethods,
    error: methodsError,
  } = usePaymentMethods(parseInt(amount || "0"), !!amount);

  useEffect(() => {
    if (methodsError) {
      toast.error("Failed to load payment methods");
      console.error("Payment methods error:", methodsError);
    }
  }, [methodsError]);

  useEffect(() => {
    if (paymentMethodsData) {
      console.log("Payment methods data:", paymentMethodsData);
    }
  }, [paymentMethodsData]);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Please enter your phone number");
      return;
    }

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      const merchantOrderId = generateMerchantOrderId(user.id);

      console.log("Generated merchantOrderId:", merchantOrderId);
      console.log("Length:", merchantOrderId.length);

      const paymentResponse = await purchaseAndPay(
        {
          userId: user.id,
          packageId: isCustomPurchase ? undefined : packageId!,
          points: parseInt(points || "0"),
          amount: parseInt(amount || "0"),
          payment_status: PaymentStatus.pending,
          merchantOrderId: merchantOrderId,
          paymentMethod: selectedPayment,
          phoneNumber: phoneNumber,
        },
        selectedPayment
      );

      if (paymentResponse.data.paymentUrl) {
        window.location.href = paymentResponse.data.paymentUrl;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotalFee = (paymentMethodCode: string) => {
    if (!paymentMethodsData?.data?.paymentFee) return 0;

    const method = paymentMethodsData.data.paymentFee.find(
      (m) => m.paymentMethod === paymentMethodCode
    );
    if (!method) return 0;

    return parseFloat(method.totalFee) || 0;
  };

  const getTotalAmount = (paymentMethodCode: string) => {
    const baseAmount = parseInt(amount || "0");
    const fee = calculateTotalFee(paymentMethodCode);
    return baseAmount + fee;
  };

  // Filter payment methods to show NUSAPAY QRIS, SHOPEEPAY QRIS, OVO, and Shopee Pay
  const filteredPaymentMethods =
    paymentMethodsData?.data?.paymentFee?.filter((method) => {
      const name = method.paymentName.toLowerCase();

      return (
        (name.includes("shopee") && !name.includes("qris")) ||
        name.includes("ovo") ||
        name.includes("nusapay") ||
        name.includes("qris")
      );
    }) || [];

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Kesalahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.push("/points")} className="mt-4">
              Kembali ke Poin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buat customPackage dengan nilai yang sudah divalidasi
  const pointsNum = parseInt(points || "0");
  const amountNum = parseInt(amount || "0");

  const customPackage = {
    id: "custom",
    name: "Pembelian Poin Kustom",
    points: pointsNum,
    price: amountNum,
    validityDays: 30,
    description: `${pointsNum} poin voting`,
  };

  const selectedPackage = isCustomPurchase
    ? customPackage
    : packages.find((pkg) => pkg.id === packageId);

  // Pastikan selectedPackage ada
  if (!selectedPackage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Kesalahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Paket yang dipilih tidak valid</p>
            <Button onClick={() => router.push("/points")} className="mt-4">
              Kembali ke Poin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Paket
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ringkasan Pesanan */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{selectedPackage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPackage.points} poin voting
                </p>
                <p className="text-sm text-muted-foreground">
                  Berlaku selama {selectedPackage.validityDays} hari
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatPrice(selectedPackage.price)}
                </p>
              </div>
            </div>

            {selectedPayment && (
              <>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedPackage.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Biaya Pembayaran</span>
                    <span>
                      {formatPrice(calculateTotalFee(selectedPayment))}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(getTotalAmount(selectedPayment))}</span>
                  </div>
                </div>
              </>
            )}

            {!selectedPayment && (
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(selectedPackage.price)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Masukkan no telp"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Diperlukan untuk konfirmasi pembayaran
              </p>
            </div>

            {/* Metode Pembayaran */}
            <div className="space-y-4">
              <Label>Metode Pembayaran</Label>

              {loadingMethods ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : methodsError ? (
                <div className="text-center py-8 text-destructive">
                  Gagal memuat metode pembayaran
                </div>
              ) : !filteredPaymentMethods.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tidak ada metode pembayaran yang tersedia</p>
                </div>
              ) : (
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(value) => {
                    console.log("Payment method selected:", value);
                    setSelectedPayment(value);
                  }}
                >
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {filteredPaymentMethods.map((method) => {
                      const fee = calculateTotalFee(method.paymentMethod);
                      return (
                        <div
                          key={method.paymentMethod}
                          className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                            selectedPayment === method.paymentMethod
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            console.log(
                              "Setting payment method to:",
                              method.paymentMethod
                            );
                            setSelectedPayment(method.paymentMethod);
                          }}
                        >
                          <RadioGroupItem
                            value={method.paymentMethod}
                            id={method.paymentMethod}
                          />
                          <div className="flex-1 flex items-center gap-3">
                            {method.paymentImage ? (
                              <div className="w-12 h-12 relative flex-shrink-0">
                                <Image
                                  src={method.paymentImage}
                                  alt={method.paymentName}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <Label
                              htmlFor={method.paymentMethod}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-medium">
                                {method.paymentName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {fee > 0
                                  ? `Biaya: ${formatPrice(fee)}`
                                  : "Tanpa biaya tambahan"}
                              </div>
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              )}
            </div>

            {/* Tombol Bayar */}
            <Button
              onClick={handlePayment}
              disabled={!selectedPayment || isProcessing || loadingMethods}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bayar{" "}
                  {selectedPayment
                    ? formatPrice(getTotalAmount(selectedPayment))
                    : formatPrice(selectedPackage.price)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
