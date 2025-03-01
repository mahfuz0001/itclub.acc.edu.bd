import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Welcome to the College IT Club
            </h1>
            <p className="max-w-[600px] text-[#94a3b8] md:text-xl">
              Where technology meets creativity and innovation. Join us to
              enhance your skills, network with like-minded individuals, and
              build the future.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/join">
              <Button size="lg" className="hero-gradient text-white">
                Join the Club
              </Button>
            </Link>
            <Link href="/#about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-xl bg-muted lg:min-h-[400px]">
          <Image
            src="/placeholder.svg?height=800&width=1200"
            alt="IT Club Members collaborating"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
