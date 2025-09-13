import HeroSection from "./Sections/HeroSection";
import HowToVoteSection from "./Sections/HowToVoteSection";
import LeaderboardSection from "./Sections/Leaderboard";

export default function HomeView() {
  return (
    <main>
      <HeroSection />
      <LeaderboardSection />
      <HowToVoteSection />
    </main>
  );
}
