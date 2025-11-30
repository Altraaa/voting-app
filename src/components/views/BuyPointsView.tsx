"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Check,
  // Zap,
  // Crown,
  // Gift,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
// import { usePackage } from "@/config/hooks/PackageHook/usePackage";
// import { IPackage } from "@/config/models/PackageModel";
import { toast } from "sonner";
import { useAuthUser } from "@/config/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

// Commenting out the package-related functions since we're not using packages anymore
/*
const getSupportTypeText = (supportType: string) => {
  switch (supportType) {
    case "BASIC":
      return "Basic support";
    case "PRIORITY":
      return "Priority support";
    case "PREMIUM":
      return "Premium support";
    case "VIP":
      return "VIP support";
    default:
      return "Basic support";
  }
};

// Map package to icon
const getPackageIcon = (pkg: IPackage, index: number) => {
  if (pkg.name.toLowerCase().includes("popular")) return Zap;
  if (
    pkg.name.toLowerCase().includes("power") ||
    pkg.name.toLowerCase().includes("premium")
  )
    return Crown;
  if (
    pkg.name.toLowerCase().includes("ultimate") ||
    pkg.name.toLowerCase().includes("vip")
  )
    return Gift;
  if (index === 0) return Star;
  return Star;
};

const generateFeatures = (pkg: IPackage): string[] => {
  const features = [
    `${pkg.points} voting points`,
    `Valid for ${pkg.validityDays} days`,
    getSupportTypeText(pkg.supportType),
  ];

  if (pkg.bonusPercentage && pkg.bonusPercentage > 0) {
    features.push(`${pkg.bonusPercentage}% bonus points`);
  }

  if (pkg.earlyAccess) {
    features.push("Early access to new categories");
  }

  return features;
};
*/

export default function PointsView() {
  const router = useRouter();
  const { user } = useAuthUser();

  // State for custom points purchase
  const [points, setPoints] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  // Commenting out package-related hooks
  /*
  const { queries: packageQueries } = usePackage();
  const { data: packages = [], isLoading: packagesLoading } =
    packageQueries.useGetAllPackages();
  */

  const handlePurchasePoints = () => {
    if (!user) {
      toast.error("Silakan login untuk membeli poin");
      return;
    }

    if (points < 10) {
      toast.error("Pembelian minimum adalah 10 poin");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      router.push(`/payment?points=${points}&amount=${points * 1000}` as Route);
      setIsLoading(false);
    }, 500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const incrementPoints = () => {
    setPoints((prev) => prev + 1);
  };

  const decrementPoints = () => {
    if (points > 10) {
      setPoints((prev) => prev - 1);
    }
  };

  return (
    <div className="px-4 lg:px-20 py-28 bg-background">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Beli <span className="text-primary">Poin</span> Voting
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Beli poin voting untuk berpartisipasi di semua kategori. Pembayaran
          aman dengan berbagai opsi tersedia.
        </p>
      </div>

      {/* Current Points Display */}
      <div className="bg-card rounded-lg p-6 mb-8 text-center border border-border max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
        <p className="text-sm text-muted-foreground mb-2">
          Saldo Saat Ini
        </p>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-6 h-6 text-primary" />
          <span className="text-3xl font-bold text-primary">
            {user?.points || 0}
          </span>
          <span className="text-lg text-muted-foreground">poin voting</span>
        </div>
      </div>

      {/* Main Content - Split Layout for Desktop */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Column - Points Purchase Card */}
        <div className="lg:w-1/2">
          <Card className="h-full border-border bg-card">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-card-foreground">
                Pembelian Poin
              </CardTitle>
              <p className="text-muted-foreground">
                Pilih jumlah poin yang Anda butuhkan
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Points Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {points}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    poin voting
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-4">
                  <Slider
                    value={[points]}
                    onValueChange={([value]) => setPoints(value)}
                    min={10}
                    max={1000}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10 poin</span>
                    <span>1000 poin</span>
                  </div>
                </div>

                {/* Quick Adjust Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementPoints}
                    disabled={points <= 10}
                    className="border-border"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-2">
                    {[50, 100, 200].map((quickPoints) => (
                      <Button
                        key={quickPoints}
                        variant="outline"
                        size="sm"
                        onClick={() => setPoints(quickPoints)}
                        className={`border-border ${
                          points === quickPoints
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {quickPoints}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementPoints}
                    className="border-border"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-card-foreground">
                  {formatPrice(points * 1000)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(1000)} per point
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 text-sm">
                {[
                  `${points} poin voting`,
                  "Berlaku selama 30 hari",
                  "Dukungan dasar",
                  "Pengiriman instan",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-card-foreground"
                  >
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Purchase Button */}
              <Button
                className="w-full"
                onClick={handlePurchasePoints}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Beli Sekarang"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - FAQ Section */}
        <div className="lg:w-1/2">
          <div className="bg-card rounded-lg p-8 border border-border h-full">
            <h2 className="text-2xl font-bold text-center mb-8 text-card-foreground">
              Pertanyaan yang Sering Ditanyakan
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-card-foreground text-lg">
                  Bagaimana cara kerja poin voting?
                </h3>
                <p className="text-muted-foreground">
                  Setiap voting memakan 1 poin. Poin akan dikurangi dari saldo
                  Anda saat Anda voting untuk kandidat di kategori mana pun.
                  Beli poin dalam jumlah besar untuk menghemat waktu dan
                  memastikan Anda tidak kehabisan poin saat periode voting
                  yang penting.
                </p>
              </div>

              <Separator className="bg-border" />

              <div>
                <h3 className="font-semibold mb-3 text-card-foreground text-lg">
                  Apakah poin kedaluwarsa?
                </h3>
                <p className="text-muted-foreground">
                  Ya, poin yang dibeli berlaku selama 30 hari dari tanggal
                  pembelian. Kami menyarankan hanya membeli apa yang Anda
                  rencanakan untuk gunakan dalam periode ini.
                </p>
              </div>

              <Separator className="bg-border" />

              <div>
                <h3 className="font-semibold mb-3 text-card-foreground text-lg">
                  Apakah pembayaran aman?
                </h3>
                <p className="text-muted-foreground">
                  Ya, semua pembayaran diproses melalui saluran aman dan
                  terenkripsi dengan penyedia pembayaran tepercaya. Kami tidak
                  pernah menyimpan informasi pembayaran Anda di server kami.
                </p>
              </div>

              <Separator className="bg-border" />

              <div>
                <h3 className="font-semibold mb-3 text-card-foreground text-lg">
                  Metode pembayaran apa yang Anda terima?
                </h3>
                <p className="text-muted-foreground">
                  Kami menerima berbagai metode pembayaran termasuk kartu
                  kredit/debit, transfer bank, dan e-wallet populer. Semua
                  transaksi diproses dengan aman.
                </p>
              </div>
            </div>

            <Separator className="my-6 bg-border" />

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Butuh bantuan dengan pembelian Anda? Tim dukungan kami siap
                membantu Anda.
              </p>
              <Button
                variant="outline"
                className="border-border hover:bg-muted"
              >
                Hubungi Dukungan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 
KEEP THE ORIGINAL PACKAGE CODE COMMENTED BELOW FOR FUTURE REFERENCE:

// Original package grid code - commented out for now
{activePackages.map((pkg, index) => {
  const PackageIcon = getPackageIcon(pkg, index);
  const features = generateFeatures(pkg);
  const isPopular = index === 1; // Second package is popular

  return (
    <Card
      key={pkg.id}
      className={`relative overflow-hidden hover:shadow-lg transition-all border-border bg-card ${
        isPopular ? "ring-2 ring-primary scale-105" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}

      <CardHeader
        className={`text-center ${isPopular ? "pt-12" : "pt-6"}`}
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <PackageIcon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl text-card-foreground">
          {pkg.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
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
          <div className="text-2xl font-bold text-card-foreground">
            {formatPrice(pkg.price)}
          </div>
        </div>

        <ul className="space-y-2 text-sm text-left">
          {features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="flex items-center gap-2 text-card-foreground"
            >
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          onClick={() => handleSelectPackage(pkg)}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
})}
*/
