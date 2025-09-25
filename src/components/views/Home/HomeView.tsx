import CurrentEventSection from "./Sections/CurrentEventSection";
import HeroSection from "./Sections/HeroSection";
import HowToVoteSection from "./Sections/HowToVoteSection";
import LeaderboardSection from "./Sections/LeaderboardSection";

export default function HomeView() {
  return (
    <main>
      <HeroSection />
      <CurrentEventSection />
      <LeaderboardSection />
      <HowToVoteSection />
    </main>
  );
}
