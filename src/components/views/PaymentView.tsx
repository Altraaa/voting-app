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

export default function PaymentView() {
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

  const {
    data: paymentMethodsData,
    isLoading: loadingMethods,
    error: methodsError,
  } = usePaymentMethods(parseInt(amount || "0"), !!amount);

  useEffect(() => {
    if (!packageId || !selectedPackage) {
      toast.error("Invalid package selected");
      router.push("/points");
    }
  }, [packageId, selectedPackage, router]);

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

    // totalFee is string, convert to number
    return parseFloat(method.totalFee) || 0;
  };

  const getTotalAmount = (paymentMethodCode: string) => {
    const baseAmount = parseInt(amount || "0");
    const fee = calculateTotalFee(paymentMethodCode);
    return baseAmount + fee;
  };

  if (!selectedPackage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const paymentMethods = paymentMethodsData?.data?.paymentFee || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Packages
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {selectedPayment && (
              <>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedPackage.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Fee</span>
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

              {loadingMethods ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : methodsError ? (
                <div className="text-center py-8 text-destructive">
                  Failed to load payment methods
                </div>
              ) : !paymentMethods.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment methods available</p>
                  <p className="text-xs mt-2">
                    Response: {JSON.stringify(paymentMethodsData)}
                  </p>
                </div>
              ) : (
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {paymentMethods.map((method) => {
                      const fee = calculateTotalFee(method.paymentMethod);
                      return (
                        <div
                          key={method.paymentMethod}
                          className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                            selectedPayment === method.paymentMethod
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setSelectedPayment(method.paymentMethod)
                          }
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
                                  ? `Fee: ${formatPrice(fee)}`
                                  : "No additional fee"}
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

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={
                !selectedPayment ||
                !phoneNumber ||
                isProcessing ||
                loadingMethods
              }
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
                  Pay{" "}
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