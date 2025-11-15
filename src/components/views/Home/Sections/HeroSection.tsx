import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Vote, Users, Calendar } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Platform Voting Digital
            <br />
            <span className="text-primary">Terpercaya</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Rasakan pengalaman voting digital yang aman dan transparan bersama Pilih.in Vote.
            Platform kami memastikan setiap suara dihitung dengan adil, memberikan hasil
            secara real-time serta analitik menyeluruh untuk pengambilan keputusan yang lebih baik.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="px-8 h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25"
              asChild
            >
              <Link href="/event">Mulai Vote</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 border-2 border-primary text-primary hover:bg-primary/5 hover"
              asChild
            >
              <Link href="/">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>

          <Card className="mt-12 mx-auto max-w-5xl backdrop-blur-sm bg-white/70 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
              {/* Total Votes */}
              <div className="py-2 px-4 flex items-center gap-5 justify-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Vote className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Total Suara
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    1,234,567
                  </p>
                </div>
              </div>

              {/* Total Clients */}
              <div className="py-2 px-4 flex items-center gap-5 justify-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Total Klien
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    500+
                  </p>
                </div>
              </div>

              {/* Total Events */}
              <div className="py-2 px-4 flex items-center gap-5 justify-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Total Acara
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    1,000+
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}