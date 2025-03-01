import Hero from "@/components/home/hero";
import RecentNews from "@/components/home/recent-news";
import Journey from "@/components/home/journey";
import AboutUs from "@/components/home/about-us";
import CurrentPanelists from "@/components/home/current-panelists";
import CurrentMembers from "@/components/home/current-members";
import Gallery from "@/components/home/gallery";
import JoinCTA from "@/components/home/join-cta";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col dark:text-white">
      <Navbar />
      <Hero />
      <RecentNews />
      <Journey />
      <AboutUs />
      <CurrentPanelists />
      <CurrentMembers />
      <Gallery />
      <JoinCTA />
      <Footer />
    </main>
  );
}
