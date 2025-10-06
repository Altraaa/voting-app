"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthUser } from "@/config/hooks/useAuthUser";
import { usePackage } from "@/config/hooks/PackageHook/usePackage";
import { PaymentStatus } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { usePurchasePoints } from "@/config/hooks/PointVotesHook/usePurchasePoint";

const paymentMethods = [
  { id: "VC", name: "Credit Card", description: "Visa, Mastercard, JCB" },
  { id: "BT", name: "Bank Transfer", description: "Transfer antar bank" },
  { id: "A1", name: "OVO", description: "OVO E-Wallet" },
  { id: "B1", name: "DANA", description: "DANA E-Wallet" },
  { id: "I1", name: "LinkAja", description: "LinkAja E-Wallet" },
  { id: "S1", name: "ShopeePay", description: "ShopeePay E-Wallet" },
  { id: "A2", name: "Gopay", description: "GoPay E-Wallet" },
  { id: "M2", name: "QRIS", description: "QRIS Payment" },
  { id: "A3", name: "Alfamart", description: "Bayar di Alfamart" },
  { id: "D1", name: "Indomaret", description: "Bayar di Indomaret" },
];

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

  const { queries: packageQueries } = usePackage();
  const { data: packages = [] } = packageQueries.useGetAllPackages();

  const selectedPackage = packages.find((pkg) => pkg.id === packageId);

  useEffect(() => {
    if (!packageId || !selectedPackage) {
      toast.error("Invalid package selected");
      router.push("/points");
    }
  }, [packageId, selectedPackage, router]);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      const merchantOrderId = `POINT-${user.id}-${packageId}-${Date.now()}`;

      await purchaseAndPay(
        {
          userId: user.id,
          packageId: packageId!,
          points: parseInt(points || "0"),
          amount: parseInt(amount || "0"),
          payment_status: PaymentStatus.pending,
          merchantOrderId: merchantOrderId,
          paymentMethod: selectedPayment,
          phoneNumber: phoneNumber,
        },
        selectedPayment
      );

    } catch (error: any) {
      console.error("Payment error:", error);
      // Error sudah ditangani oleh hook, tidak perlu menampilkan toast lagi
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!selectedPackage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Packages
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{selectedPackage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPackage.points} voting points
                </p>
                <p className="text-sm text-muted-foreground">
                  Valid for {selectedPackage.validityDays} days
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatPrice(selectedPackage.price)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(selectedPackage.price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Required for payment confirmation
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Payment Method</Label>
              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
              >
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={!selectedPayment || !phoneNumber || isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Pay {formatPrice(selectedPackage.price)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}