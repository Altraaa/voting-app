import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Vote, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Route } from "next";

const steps = [
  {
    icon: CreditCard,
    title: "Buy Voting Points",
    description:
      "Purchase voting points starting from IDR 5,000 for 5 points. Secure payment with multiple options.",
    action: "Get Points",
    href: "/points",
  },
  {
    icon: Vote,
    title: "Choose & Vote",
    description:
      "Browse categories, select your favorite candidates, and cast your votes using your points.",
    action: "Browse Categories",
    href: "/categories",
  },
  {
    icon: Trophy,
    title: "See Results",
    description:
      "Watch real-time results update instantly. Track your favorite candidates' progress live.",
    action: "View Leaderboard",
    href: "#leaderboard",
  },
];

export default function HowToVoteSection() {
  return (
    <section className="py-20 px-4 lg:px-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-balance">
          How to <span className="text-primary">Vote</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Get started with voting in just 3 simple steps. It&apos;s fast,
          secure, and transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="relative text-center hover:shadow-lg transition-shadow"
          >
            <CardContent className="pt-8 pb-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>

              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-pretty">
                {step.description}
              </p>

              <Button variant="outline" asChild className="mt-4 bg-transparent">
                <Link href={step.href as Route}>
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground mb-4">
          Need help? Check our FAQ or contact support
        </p>
        <Button variant="ghost" asChild>
          <Link href="/help">Get Help</Link>
        </Button>
      </div>
    </section>
  );
}
