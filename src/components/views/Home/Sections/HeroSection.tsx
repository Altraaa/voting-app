import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Users, Trophy, Shield } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-background" />
      <div className="relative">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-8">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            🔥 Real-time Voting Platform
          </Badge>

          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            Vote with <span className="text-primary">Confidence</span>
            <br />
            See Results <span className="text-primary">Instantly</span>
          </h1>

          <p className="text-sm md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join thousands of voters on Indonesia&apos;s most trusted voting platform. Transparent results, secure
            point-based system, and real-time updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-6" asChild>
              <Link href="/event">
                Start Voting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 bg-transparent" asChild>
              <Link href="/points">Buy Voting Points</Link>
            </Button>
          </div>

          <div className="grid px-4 md:px-0 grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">50,000+ Active Voters</h3>
              <p className="text-sm text-muted-foreground text-center">Join our growing community of engaged voters</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Real-time Results</h3>
              <p className="text-sm text-muted-foreground text-center">Watch votes update instantly as they come in</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">100% Secure</h3>
              <p className="text-sm text-muted-foreground text-center">Advanced security measures protect every vote</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}