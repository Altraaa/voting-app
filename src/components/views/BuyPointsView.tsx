"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  CreditCard,
  Smartphone,
  Building2,
  Check,
  Zap,
  Crown,
  Gift,
} from "lucide-react";

// Point packages data
const pointPackages = [
  {
    id: 1,
    name: "Starter Pack",
    points: 5,
    price: 5000,
    originalPrice: null,
    popular: false,
    icon: Star,
    description: "Perfect for trying out the platform",
    features: ["5 voting points", "Valid for 30 days", "Basic support"],
  },
  {
    id: 2,
    name: "Popular Pack",
    points: 15,
    price: 12000,
    originalPrice: 15000,
    popular: true,
    icon: Zap,
    description: "Most chosen by our users",
    features: [
      "15 voting points",
      "Valid for 60 days",
      "Priority support",
      "20% bonus points",
    ],
  },
  {
    id: 3,
    name: "Power Pack",
    points: 30,
    price: 20000,
    originalPrice: 30000,
    popular: false,
    icon: Crown,
    description: "For active voters",
    features: [
      "30 voting points",
      "Valid for 90 days",
      "Premium support",
      "33% bonus points",
    ],
  },
  {
    id: 4,
    name: "Ultimate Pack",
    points: 100,
    price: 50000,
    originalPrice: 100000,
    popular: false,
    icon: Gift,
    description: "Best value for heavy users",
    features: [
      "100 voting points",
      "Valid for 180 days",
      "VIP support",
      "50% bonus points",
      "Early access to new categories",
    ],
  },
];

// Payment methods
const paymentMethods = [
  { id: "gopay", name: "GoPay", icon: Smartphone },
  { id: "ovo", name: "OVO", icon: Smartphone },
  { id: "dana", name: "DANA", icon: Smartphone },
  { id: "bank", name: "Bank Transfer", icon: Building2 },
  { id: "credit", name: "Credit Card", icon: CreditCard },
];

export default function PointsView() {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPoints] = useState(10); // Mock current user points

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setSelectedPayment("");
    // In real app, redirect to payment gateway or show success message
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="px-20 py-28">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">
          Buy Voting <span className="text-primary">Points</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Purchase voting points to participate in all categories. Secure
          payment with multiple options available.
        </p>
      </div>

      {/* Current Points Display */}
      <div className="bg-card rounded-lg p-6 mb-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Your Current Balance
        </p>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-6 h-6 text-primary" />
          <span className="text-3xl font-bold text-primary">
            {currentPoints}
          </span>
          <span className="text-lg text-muted-foreground">voting points</span>
        </div>
      </div>

      {/* Point Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {pointPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative overflow-hidden hover:shadow-lg transition-all ${
              pkg.popular ? "ring-2 ring-primary scale-105" : ""
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}

            <CardHeader
              className={`text-center ${pkg.popular ? "pt-12" : "pt-6"}`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <pkg.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <p className="text-sm text-muted-foreground text-pretty">
                {pkg.description}
              </p>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {pkg.points}
                </div>
                <div className="text-sm text-muted-foreground">
                  voting points
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold">
                  {formatPrice(pkg.price)}
                </div>
                {pkg.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(pkg.originalPrice)}
                  </div>
                )}
              </div>

              <ul className="space-y-2 text-sm text-left">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Select Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                    <DialogDescription>
                      You&apos;re purchasing {pkg.name} - {pkg.points} voting points
                      for {formatPrice(pkg.price)}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="bg-card rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Package Details</h4>
                      <div className="flex justify-between items-center">
                        <span>{pkg.name}</span>
                        <span className="font-bold">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.points} voting points
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Payment Method</h4>
                      <RadioGroup
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                      >
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label
                              htmlFor={method.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <method.icon className="w-4 h-4" />
                              {method.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPayment("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePurchase}
                      disabled={!selectedPayment || isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : `Pay ${formatPrice(pkg.price)}`}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-card rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">How do voting points work?</h3>
            <p className="text-sm text-muted-foreground">
              Each vote costs 1 point. Points are deducted from your balance
              when you vote for candidates in any category.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Do points expire?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, points have different validity periods depending on the
              package you choose, ranging from 30 to 180 days.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can I get a refund?</h3>
            <p className="text-sm text-muted-foreground">
              Unused points can be refunded within 7 days of purchase. Contact
              our support team for assistance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Is payment secure?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, all payments are processed through secure, encrypted channels
              with trusted payment providers.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your purchase? Our support team is here to assist
            you.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </div>
  );
}
