import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ABOUT_DATA } from "@/constants/home-content";

export default function AboutUs() {
  return (
    <section className="bg-muted py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">About Us</h2>
            <p className="mb-6 text-[#94a3b8]">{ABOUT_DATA.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {ABOUT_DATA.stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card p-4 text-center"
                >
                  <div className="text-3xl font-bold text-[#3b82f6]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#94a3b8]">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative order-first md:order-last">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={
                  ABOUT_DATA.image || "/placeholder.svg?height=600&width=600"
                }
                alt="About our IT Club"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-lg bg-primary" />
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-lg bg-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
