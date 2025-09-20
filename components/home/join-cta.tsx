import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTASection } from "../blocks/cta-with-rectangle";

export default function JoinCTA() {
  return (
    <CTASection
      badge={{
        text: "🔥 Limited Spots Available",
      }}
      title="Join Bangladesh's Most Elite Tech Community!"
      description="🚀 200+ Active Members • 50+ Events/Year • Industry Connections • Real Projects • Career Growth
      
      Don't miss out - Join ACCITC today and transform your tech journey with like-minded innovators, exclusive workshops, and direct mentorship from industry experts!"
      action={{
        text: "🎯 Secure Your Spot Now",
        href: "/join",
        variant: "glow",
      }}
    />
  );
}
