"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPanelists } from "@/lib/firebase/panelists";
import { Panelist } from "@/types/panelist";

export default function PanelistsSection() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const panelistsData = await getPanelists();
        setPanelists(panelistsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching panelists:", error);
        setLoading(false);
      }
    };

    fetchPanelists();
  }, []);

  const placeholderPanelists: Panelist[] = loading
    ? [
        {
          id: "1",
          name: "Alex Johnson",
          position: "President",
          batch: "2025",
          department: "Computer Science",
          image: "/placeholder.svg?height=300&width=300",
          bio: "Leading the club with a passion for AI and machine learning.",
          socialLinks: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            twitter: "https://twitter.com",
          },
        },
        {
          id: "2",
          name: "Maya Patel",
          position: "Vice President",
          batch: "2025",
          department: "Information Technology",
          image: "/placeholder.svg?height=300&width=300",
          bio: "Cybersecurity enthusiast with experience in network protection.",
          socialLinks: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
          },
        },
        {
          id: "3",
          name: "David Kim",
          position: "Technical Lead",
          batch: "2026",
          department: "Software Engineering",
          image: "/placeholder.svg?height=300&width=300",
          bio: "Full-stack developer with expertise in modern web frameworks.",
          socialLinks: {
            linkedin: "https://linkedin.com",
            github: "https://github.com",
          },
        },
        {
          id: "4",
          name: "Sarah Chen",
          position: "Event Coordinator",
          batch: "2026",
          department: "Digital Media",
          image: "/placeholder.svg?height=300&width=300",
          bio: "Creative thinker who loves organizing engaging tech events.",
          socialLinks: {
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
          },
        },
      ]
    : panelists;

  return (
    <section
      className="container space-y-6 py-8 md:py-12 lg:py-16"
      id="panelists"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Current Panelists
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          Meet our dedicated team of leaders who drive the club's vision and
          activities.
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-4">
        {placeholderPanelists.map((panelist) => (
          <Card key={panelist.id}>
            <CardHeader className="p-0">
              <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={panelist.image || "/placeholder.svg"}
                  alt={panelist.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle>{panelist.name}</CardTitle>
              <CardDescription className="flex flex-col">
                <span className="font-medium text-[#3b82f6]">
                  {panelist.position}
                </span>
                <span>
                  {panelist.department} | Batch {panelist.batch}
                </span>
              </CardDescription>
              <p className="mt-2 text-sm text-[#94a3b8]">{panelist.bio}</p>
            </CardContent>
            <CardFooter className="flex justify-start gap-4 p-6 pt-0">
              {panelist?.socialLinks?.linkedin && (
                <a
                  href={panelist.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {panelist?.socialLinks?.github && (
                <a
                  href={panelist.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {panelist?.socialLinks?.twitter && (
                <a
                  href={panelist.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
