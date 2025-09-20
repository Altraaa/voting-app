"use client";
import React, { useState } from "react";
import {
  User,
  Package,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  store: string;
  image: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  available: boolean;
}

interface Coupon {
  code: string;
  discount: number;
  description: string;
}

export default function PaymentView() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Vote Points Package",
      variant: "Premium Package - 1000 Points",
      price: 50000,
      quantity: 1,
      store: "Klik Vote",
      image: "",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState("indomaret");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const paymentMethods: PaymentMethod[] = [
    {
      id: "indomaret",
      name: "Indomaret",
      type: "offline",
      icon: "IDM",
      available: true,
    },
    {
      id: "bca",
      name: "BCA Virtual Account",
      type: "va",
      icon: "BCA",
      available: true,
    },
    {
      id: "mandiri",
      name: "Mandiri Virtual Account",
      type: "va",
      icon: "MDR",
      available: true,
    },
    {
      id: "bri",
      name: "BRI Virtual Account",
      type: "va",
      icon: "BRI",
      available: true,
    },
    {
      id: "visa",
      name: "Visa Credit Card",
      type: "card",
      icon: "VISA",
      available: true,
    },
    {
      id: "mastercard",
      name: "Mastercard",
      type: "card",
      icon: "MC",
      available: true,
    },
    {
      id: "gopay",
      name: "GoPay",
      type: "ewallet",
      icon: "GP",
      available: true,
    },
    { id: "ovo", name: "OVO", type: "ewallet", icon: "OVO", available: true },
  ];

  const paymentCategories = {
    "Kartu Kredit / Debit / Cicilan": paymentMethods.filter(
      (p) => p.type === "card"
    ),
    PayLater: [
      {
        id: "paylater",
        name: "PayLater",
        type: "paylater",
        icon: "🎵",
        available: false,
      },
      {
        id: "ceria",
        name: "BRI Ceria",
        type: "paylater",
        icon: "CERIA",
        available: true,
      },
    ],
    "Virtual Account": paymentMethods.filter((p) => p.type === "va"),
    "Debit Instan": paymentMethods.filter((p) => p.type === "debit"),
    "Pembayaran Instan": paymentMethods.filter((p) => p.type === "ewallet"),
    "Gerai Offline": paymentMethods.filter((p) => p.type === "offline"),
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;

    const validCoupons = {
      WELCOME10: {
        discount: 5000,
        description: "Diskon 10% untuk pengguna baru",
      },
      SAVE20: { discount: 10000, description: "Hemat Rp 10.000" },
    };

    const coupon =
      validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];

    if (
      coupon &&
      !appliedCoupons.find((c) => c.code === couponCode.toUpperCase())
    ) {
      setAppliedCoupons((prev) => [
        ...prev,
        {
          code: couponCode.toUpperCase(),
          discount: coupon.discount,
          description: coupon.description,
        },
      ]);
      setCouponCode("");
    } else if (!coupon) {
      alert("Kode kupon tidak valid");
    } else {
      alert("Kupon sudah digunakan");
    }
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const calculateCouponDiscount = () => {
    return appliedCoupons.reduce((total, coupon) => total + coupon.discount, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateCouponDiscount();
  };

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  const PaymentMethodIcon = ({ method }: { method: PaymentMethod | any }) => {
    const iconClasses =
      "w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold";

    switch (method.id) {
      case "indomaret":
        return <div className={`${iconClasses} bg-orange-500`}>IDM</div>;
      case "bca":
        return <div className={`${iconClasses} bg-blue-600`}>BCA</div>;
      case "mandiri":
        return <div className={`${iconClasses} bg-blue-800`}>MDR</div>;
      case "bri":
        return <div className={`${iconClasses} bg-blue-900`}>BRI</div>;
      case "visa":
        return <div className={`${iconClasses} bg-blue-700`}>VISA</div>;
      case "mastercard":
        return <div className={`${iconClasses} bg-red-600`}>MC</div>;
      case "gopay":
        return <div className={`${iconClasses} bg-green-600`}>GP</div>;
      case "ovo":
        return <div className={`${iconClasses} bg-purple-600`}>OVO</div>;
      case "ceria":
        return (
          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
            CERIA
          </div>
        );
      case "paylater":
        return <span className="text-lg">🎵</span>;
      default:
        return <div className={`${iconClasses} bg-gray-500`}>💳</div>;
    }
  };

  return (
    <div
      className="min-h-screen px-4 md:px-16 py-12 md:py-18"
      style={{ backgroundColor: "oklch(1 0 0)" }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Title */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="p-0">
            <CardTitle
              className="text-2xl lg:text-3xl font-bold mb-2"
              style={{ color: "oklch(0.3 0.02 60)" }}
            >
              Checkout
            </CardTitle>
            <CardDescription style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}>
              Complete your vote points purchase securely
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Information */}
            <Card
              className="rounded-lg border shadow-sm py-8"
              style={{
                backgroundColor: "oklch(0.95 0.02 60)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardHeader className="px-6">
                <CardTitle
                  className="text-sm font-medium uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                >
                  <User className="h-4 w-4" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="rounded-lg"
                  style={{ backgroundColor: "oklch(0.95 0.02 60 / 0.5)" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                      style={{ backgroundColor: "oklch(0.5 0.05 60)" }}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold mb-1"
                        style={{ color: "oklch(0.3 0.02 60)" }}
                      >
                        John Doe
                      </div>
                      <div
                        className="text-sm mb-2"
                        style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                      >
                        johndoe@example.com
                      </div>
                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                      >
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Vote points akan otomatis ditambahkan ke akun Anda
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card
              className="rounded-lg border shadow-sm py-8"
              style={{
                backgroundColor: "oklch(0.95 0.02 60)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardHeader className="px-6">
                <CardTitle
                  className="text-sm font-medium uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                >
                  <Package className="h-4 w-4" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.map((product) => (
                  <div key={product.id} className="space-y-4">
                    <div className="flex gap-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 text-white bg-gradient-to-br"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, oklch(0.5 0.05 60), oklch(0.5 0.05 60 / 0.8))",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">VP</div>
                          <div className="text-xs">Vote</div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: "oklch(0.3 0.02 60)" }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-sm mb-2"
                          style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                        >
                          {product.variant}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-oklch(0.8 0.03 60) text-oklch(0.3 0.02 60)"
                          >
                            <Clock className="h-3 w-3 mr-1 inline" />
                            Instant Delivery
                          </Badge>
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                          >
                            • Delivered to your account
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 p-0"
                              onClick={() =>
                                updateQuantity(product.id, product.quantity - 1)
                              }
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </Button>
                            <span className="font-semibold min-w-[2rem] text-center">
                              {product.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 p-0"
                              onClick={() =>
                                updateQuantity(product.id, product.quantity + 1)
                              }
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </Button>
                          </div>

                          <div
                            className="font-bold text-lg"
                            style={{ color: "oklch(0.3 0.02 60)" }}
                          >
                            {formatCurrency(product.price * product.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Digital Delivery Info */}
            <Card
              className="rounded-lg border shadow-sm py-8"
              style={{
                backgroundColor: "oklch(0.95 0.02 60 / 0.5)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardContent className="px-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "oklch(0.5 0.05 60 / 0.1)",
                      color: "oklch(0.5 0.05 60)",
                    }}
                  >
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: "oklch(0.3 0.02 60)" }}
                    >
                      Digital Delivery
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                    >
                      Vote points will be automatically added to your account
                      within 5 minutes after successful payment. No physical
                      delivery required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Payment Methods */}
            <Card
              className="rounded-lg border shadow-sm py-8"
              style={{
                backgroundColor: "oklch(0.95 0.02 60)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardHeader className="px-6">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                  >
                    Payment Method
                  </CardTitle>
                  <Button
                    variant="link"
                    className="text-sm p-0 h-auto"
                    style={{ color: "oklch(0.5 0.05 60)" }}
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 space-y-3">
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  {paymentMethods.slice(0, 4).map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-current bg-current/5"
                          : "hover:border-current/50"
                      }`}
                      style={{
                        borderColor:
                          selectedPayment === method.id
                            ? "oklch(0.5 0.05 60)"
                            : "oklch(0.85 0.02 60)",
                        backgroundColor:
                          selectedPayment === method.id
                            ? "oklch(0.5 0.05 60 / 0.05)"
                            : "transparent",
                      }}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <PaymentMethodIcon method={method} />
                        <Label
                          htmlFor={method.id}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {method.name}
                        </Label>
                      </div>
                      <RadioGroupItem value={method.id} id={method.id} />
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Coupon Input */}
            <Card
              className="rounded-lg border shadow-sm py-8"
              style={{
                backgroundColor: "oklch(0.95 0.02 60)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardHeader className="px-6">
                <CardTitle
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                >
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1"
                    style={{ borderColor: "oklch(0.85 0.02 60)" }}
                  />
                  <Button
                    onClick={applyCoupon}
                    className="font-medium"
                    style={{ backgroundColor: "oklch(0.5 0.05 60)" }}
                  >
                    Apply
                  </Button>
                </div>

                {/* Applied Coupons */}
                {appliedCoupons.length > 0 && (
                  <div className="space-y-2">
                    {appliedCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="border-2 border-green-200 bg-green-50 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-green-900">
                                Promo applied successfully
                              </div>
                              <div className="text-xs text-green-700">
                                {coupon.description}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-red-100 rounded"
                            onClick={() => removeCoupon(coupon.code)}
                          >
                            <X className="w-4 h-4 text-red-600 mx-auto" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card
              className="rounded-lg border shadow-sm sticky top-24"
              style={{
                backgroundColor: "oklch(0.95 0.02 60)",
                borderColor: "oklch(0.85 0.02 60)",
              }}
            >
              <CardHeader className="px-6">
                <CardTitle
                  className="text-lg font-semibold"
                  style={{ color: "oklch(0.3 0.02 60)" }}
                >
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}>
                      Subtotal (
                      {products.reduce((sum, p) => sum + p.quantity, 0)} items)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculateSubtotal())}
                    </span>
                  </div>

                  {appliedCoupons.length > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo discount ({appliedCoupons.length})</span>
                      <span className="font-medium">
                        -{formatCurrency(calculateCouponDiscount())}
                      </span>
                    </div>
                  )}
                </div>

                <Separator
                  className="my-4"
                  style={{ backgroundColor: "oklch(0.85 0.02 60)" }}
                />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span
                    className="font-bold text-xl"
                    style={{ color: "oklch(0.3 0.02 60)" }}
                  >
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>

                <Button
                  className="w-full py-6 text-base font-semibold"
                  style={{ backgroundColor: "oklch(0.5 0.05 60)" }}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Pay Now
                </Button>

                <p
                  className="text-xs text-center leading-relaxed"
                  style={{ color: "oklch(0.3 0.02 60 / 0.7)" }}
                >
                  By proceeding with payment, you agree to our{" "}
                  <span className="underline cursor-pointer hover:opacity-80">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="underline cursor-pointer hover:opacity-80">
                    Privacy Policy
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent
          className="w-full max-w-md max-h-96 overflow-y-auto rounded-lg p-6"
          style={{ backgroundColor: "oklch(0.95 0.02 60)" }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Select Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {Object.entries(paymentCategories).map(
              ([categoryName, methods]) => (
                <div key={categoryName} className="space-y-2">
                  <div
                    className="font-medium text-sm cursor-pointer flex items-center justify-between hover:opacity-70 transition-colors py-2"
                    onClick={() => toggleSection(categoryName)}
                  >
                    {categoryName}
                    {expandedSections[categoryName] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>

                  {expandedSections[categoryName] && (
                    <div
                      className="space-y-2 ml-4 border-l-2 pl-4"
                      style={{ borderColor: "oklch(0.85 0.02 60)" }}
                    >
                      <RadioGroup
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                      >
                        {methods.map((method: any) => (
                          <div
                            key={method.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                              !method.available
                                ? "opacity-50 cursor-not-allowed"
                                : selectedPayment === method.id
                                ? "border-current bg-current/5"
                                : "hover:bg-gray-50"
                            }`}
                            style={{
                              borderColor:
                                selectedPayment === method.id
                                  ? "oklch(0.5 0.05 60)"
                                  : "oklch(0.85 0.02 60)",
                              backgroundColor:
                                selectedPayment === method.id
                                  ? "oklch(0.5 0.05 60 / 0.05)"
                                  : undefined,
                            }}
                            onClick={() =>
                              method.available && setSelectedPayment(method.id)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <PaymentMethodIcon method={method} />
                              <div>
                                <Label
                                  htmlFor={method.id}
                                  className="font-medium text-sm cursor-pointer"
                                >
                                  {method.name}
                                </Label>
                                {!method.available && (
                                  <div
                                    className="text-xs"
                                    style={{
                                      color: "oklch(0.3 0.02 60 / 0.7)",
                                    }}
                                  >
                                    Not Available
                                  </div>
                                )}
                              </div>
                            </div>
                            {method.available && (
                              <RadioGroupItem
                                value={method.id}
                                id={method.id}
                              />
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
