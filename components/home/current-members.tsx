"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  stream: string;
  batch: string;
  photoUrl?: string;
}

export default function CurrentMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data: Member[] = await response.json();
        setMembers(data);

        const uniqueYears = Array.from(
          new Set(data.map((m: Member) => m.batch))
        ).sort((a, b) => b.localeCompare(a));
        setYears(uniqueYears);
        setActiveYear(uniqueYears[0] || "");
      } catch (error) {
        console.error("Error fetching members:", error);
        toast({
          title: "Error",
          description: "Failed to load members. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  const filteredMembers = members.filter(
    (member) => member.batch === activeYear
  );

  return (
    <section className="py-20 bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-white bg-gradient-to-r from-primary to-secondary">
            Current Members
          </h2>
          <p className="mx-auto max-w-2xl mt-4 text-xl text-[#94a3b8]">
            Our talented club members who make everything possible
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-64" />
          </div>
        ) : (
          <Tabs
            value={activeYear}
            onValueChange={setActiveYear}
            className="w-full mb-8"
          >
            <TabsList className="justify-center p-1 bg-muted/50 backdrop-blur-sm rounded-full inline-flex mx-auto">
              {years.map((year) => (
                <TabsTrigger
                  key={year}
                  value={year}
                  className="px-4 py-2 rounded-full data-[state=active]:bg-[#3b82f6] data-[state=active]:text-[#0f172a] transition-all duration-300"
                >
                  {year}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array(8)
                .fill(null)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/50 backdrop-blur-sm border-none shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            : filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors duration-300">
                          <img
                            src={
                              member.photoUrl ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt={member.name}
                            className="h-12 w-12 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg group-hover:text-[#3b82f6] transition-colors duration-300">
                            {member.name}
                          </h3>
                          <p className="text-sm text-[#94a3b8]">
                            {member.stream}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
