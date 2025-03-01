"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Panelist {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  description: string;
  session: string;
  rank: string;
  contact: string;
}

export default function CurrentPanelists() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await fetch("/api/panelists");
        if (!response.ok) {
          throw new Error("Failed to fetch panelists");
        }
        const data = await response.json();
        console.log("Fetched panelists data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response: Expected an array");
        }
        setPanelists(data);
      } catch (error) {
        console.error("Error fetching panelists:", error);
        toast({
          title: "Error",
          description: "Failed to load panelists. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPanelists();
  }, [toast]);

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-white bg-gradient-to-r from-primary to-secondary">
            Current Panelists
          </h2>
          <p className="mx-auto max-w-2xl mt-4 text-xl text-[#94a3b8]">
            Meet our dedicated team of panelists who lead the IT club
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array(4)
                .fill(null)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/50 backdrop-blur-sm border-none shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <Skeleton className="mb-4 h-32 w-32 rounded-full" />
                        <Skeleton className="mb-2 h-6 w-32" />
                        <Skeleton className="mb-4 h-4 w-24" />
                        <div className="flex justify-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            : (panelists || []).map((panelist, index) => (
                <motion.div
                  key={panelist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 overflow-hidden rounded-full border-4 border-primary/20 group-hover:border-primary transition-colors duration-300">
                          <img
                            src={
                              panelist.photoUrl ||
                              "/placeholder.svg?height=128&width=128"
                            }
                            alt={panelist.name}
                            className="h-32 w-32 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h3 className="mb-1 text-xl font-bold">
                          {panelist.name}
                        </h3>
                        <p className="mb-4 text-sm text-[#3b82f6]">
                          {panelist.position}
                        </p>
                        <p className="mb-4 text-sm text-[#94a3b8]">
                          {panelist.description}
                        </p>
                        <p className="mb-4 text-xs text-[#3b82f6]">
                          Session: {panelist.session}
                        </p>
                        <p className="mb-4 text-xs text-[#3b82f6]">
                          Rank: {panelist.rank}
                        </p>
                        <p className="mb-4 text-xs text-[#94a3b8]">
                          Contact: {panelist.contact}
                        </p>

                        <div className="flex justify-center space-x-3">
                          {panelist.socialLinks?.facebook && (
                            <a
                              href={panelist.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full p-2 text-[#94a3b8] hover:bg-[#3b82f6] hover:text-[#0f172a] transition-colors duration-300"
                            >
                              <Facebook className="h-5 w-5" />
                              <span className="sr-only">Facebook</span>
                            </a>
                          )}
                          {panelist.socialLinks?.twitter && (
                            <a
                              href={panelist.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full p-2 text-[#94a3b8] hover:bg-[#3b82f6] hover:text-[#0f172a] transition-colors duration-300"
                            >
                              <Twitter className="h-5 w-5" />
                              <span className="sr-only">Twitter</span>
                            </a>
                          )}
                          {panelist.socialLinks?.linkedin && (
                            <a
                              href={panelist.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full p-2 text-[#94a3b8] hover:bg-[#3b82f6] hover:text-[#0f172a] transition-colors duration-300"
                            >
                              <Linkedin className="h-5 w-5" />
                              <span className="sr-only">LinkedIn</span>
                            </a>
                          )}
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
