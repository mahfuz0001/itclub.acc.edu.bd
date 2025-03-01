import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JoinCTA() {
  return (
    <section className="container py-8 md:py-12 lg:py-16">
      <div className="hero-gradient mx-auto max-w-6xl rounded-xl px-8 py-12 text-center text-white md:px-12 md:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Ready to join our community of tech enthusiasts?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
          Whether you're a beginner or an experienced coder, we welcome all students passionate about technology.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/join">
            <Button size="lg" className="border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20">
              Apply Now
            </Button>
          </Link>
          <Link href="/#about">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

