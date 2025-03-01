import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    id: "1",
    title: "Web Development Bootcamp",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab, Building 3",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Join us for an intensive bootcamp covering HTML, CSS, JavaScript, and modern frameworks.",
    link: "/events/web-development-bootcamp",
  },
  {
    id: "2",
    title: "AI Workshop Series",
    date: "March 22-24, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Lecture Hall A, Building 1",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "A three-day workshop exploring artificial intelligence, machine learning, and their applications.",
    link: "/events/ai-workshop-series",
  },
  {
    id: "3",
    title: "Tech Talk: Emerging Technologies",
    date: "April 5, 2024",
    time: "3:00 PM - 5:00 PM",
    location: "Main Auditorium",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Industry experts share insights on blockchain, quantum computing, and the future of tech.",
    link: "/events/tech-talk-emerging-technologies",
  },
];

export default function EventsSection() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-16">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Upcoming Events
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          Discover our upcoming workshops, tech talks, and networking sessions.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">{event.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={event.link} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/events">
          <Button className="mt-6">View All Events</Button>
        </Link>
      </div>
    </section>
  );
}
