import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTASection } from "../blocks/cta-with-rectangle";

export default function JoinCTA() {
  return (
    <CTASection
      // badge={{
      //   text: "Get started",
      // }}
      title="Join the ACC IT Club Today!"
      description="Become a part of our growing community of tech enthusiasts. Learn, collaborate, and grow with us!"
      action={{
        text: "Get Started",
        href: "/join",
        variant: "default",
      }}
    />
  );
}
