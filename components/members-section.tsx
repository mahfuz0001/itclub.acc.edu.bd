"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const years = ["2025", "2026", "2027"];

interface Member {
  id: string;
  name: string;
  department: string;
  interests: string[];
}

const membersByYear: Record<string, Member[]> = {
  "2025": [
    {
      id: "1",
      name: "Jordan Lee",
      department: "Computer Science",
      interests: ["Machine Learning", "Mobile Development"],
    },
    {
      id: "2",
      name: "Taylor Reed",
      department: "Information Systems",
      interests: ["Web Development", "UX Design"],
    },
    {
      id: "3",
      name: "Casey Morgan",
      department: "Cybersecurity",
      interests: ["Network Security", "Ethical Hacking"],
    },
    {
      id: "4",
      name: "Riley Jenkins",
      department: "Software Engineering",
      interests: ["Cloud Computing", "DevOps"],
    },
    {
      id: "5",
      name: "Avery Williams",
      department: "Computer Science",
      interests: ["Data Science", "AI"],
    },
    {
      id: "6",
      name: "Jamie Wilson",
      department: "Information Technology",
      interests: ["IoT", "Embedded Systems"],
    },
  ],
  "2026": [
    {
      id: "7",
      name: "Alex Davis",
      department: "Computer Science",
      interests: ["Game Development", "AR/VR"],
    },
    {
      id: "8",
      name: "Jordan Smith",
      department: "Digital Media",
      interests: ["UI Design", "Front-end Development"],
    },
    {
      id: "9",
      name: "Taylor Johnson",
      department: "Information Systems",
      interests: ["Database Management", "System Analysis"],
    },
    {
      id: "10",
      name: "Casey Brown",
      department: "Software Engineering",
      interests: ["Algorithm Design", "Competitive Programming"],
    },
    {
      id: "11",
      name: "Riley Garcia",
      department: "Computer Engineering",
      interests: ["Robotics", "Hardware Design"],
    },
    {
      id: "12",
      name: "Avery Martinez",
      department: "Cybersecurity",
      interests: ["Cryptography", "Security Auditing"],
    },
  ],
  "2027": [
    {
      id: "13",
      name: "Jamie Rodriguez",
      department: "Computer Science",
      interests: ["Web3", "Blockchain"],
    },
    {
      id: "14",
      name: "Sam Taylor",
      department: "AI & Data Science",
      interests: ["Neural Networks", "Computer Vision"],
    },
    {
      id: "15",
      name: "Quinn Anderson",
      department: "Software Development",
      interests: ["Mobile Apps", "Cross-platform Development"],
    },
    {
      id: "16",
      name: "Parker Martin",
      department: "Information Technology",
      interests: ["Network Administration", "Cloud Infrastructure"],
    },
    {
      id: "17",
      name: "Drew Hernandez",
      department: "Digital Media",
      interests: ["3D Modeling", "Animation"],
    },
    {
      id: "18",
      name: "Skyler Lopez",
      department: "Computer Engineering",
      interests: ["IoT", "Microcontrollers"],
    },
  ],
};

export default function MembersSection() {
  const [activeYear, setActiveYear] = useState(years[0]);

  return (
    <section
      className="container space-y-6 py-8 md:py-12 lg:py-16"
      id="members"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Our Members
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          Meet the talented students who make up our vibrant community.
        </p>
      </div>

      <Tabs
        defaultValue={activeYear}
        onValueChange={setActiveYear}
        className="mx-auto max-w-4xl"
      >
        <div className="flex justify-center">
          <TabsList>
            {years.map((year) => (
              <TabsTrigger key={year} value={year}>
                Batch {year}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {years.map((year) => (
          <TabsContent key={year} value={year} className="mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {membersByYear[year].map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-secondary px-3 py-1 text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
