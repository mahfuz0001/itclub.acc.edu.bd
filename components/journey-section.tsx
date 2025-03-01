import { Milestone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JourneyItem = {
  year: string;
  title: string;
  description: string;
};

const journeyItems: JourneyItem[] = [
  {
    year: "2018",
    title: "Club Foundation",
    description:
      "The IT Club was founded by a small group of passionate students with a vision to create a vibrant tech community on campus.",
  },
  {
    year: "2019",
    title: "First Hackathon",
    description:
      "We organized our first 24-hour hackathon, which became an annual tradition attracting participants from multiple colleges.",
  },
  {
    year: "2020",
    title: "Virtual Transition",
    description:
      "Successfully pivoted to virtual events and workshops during the pandemic, expanding our reach beyond physical limitations.",
  },
  {
    year: "2021",
    title: "Industry Partnerships",
    description:
      "Established partnerships with leading tech companies to provide internship opportunities and mentorship for our members.",
  },
  {
    year: "2022",
    title: "Campus Tech Fest",
    description:
      "Launched our flagship event, the Campus Tech Fest, bringing together industry experts, alumni, and students for a week of innovation.",
  },
  {
    year: "2023",
    title: "Global Recognition",
    description:
      "Our members represented the college in international competitions, winning accolades and establishing our global presence.",
  },
];

export default function JourneySection() {
  return (
    <section
      className="container space-y-6 py-8 md:py-12 lg:py-16"
      id="journey"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Our Journey
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          From humble beginnings to a thriving community of tech enthusiasts.
          Here's how we've grown over the years.
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-ml-0.5" />

        <div className="space-y-6">
          {journeyItems.map((item, index) => (
            <div key={index} className="relative">
              <div
                className={`flex flex-col items-start gap-6 md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2" />
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#020817] ring-1 ring-border md:absolute md:left-1/2 md:-ml-4">
                  <Milestone className="h-4 w-4" />
                </div>
                <Card
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="hero-gradient rounded px-2 py-1 text-sm font-medium text-white">
                        {item.year}
                      </span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
