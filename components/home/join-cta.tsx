import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinCTA() {
  return (
    <section className="bg-[#3b82f6] py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Join Our IT Club?
          </h2>
          <p className="mb-8 text-lg text-[#0f172a]/90">
            Become a part of our growing community of tech enthusiasts. Learn,
            collaborate, and grow with us!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/join">Apply Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
