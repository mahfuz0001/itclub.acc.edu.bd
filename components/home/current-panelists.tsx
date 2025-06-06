"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Linkedin, Twitter, Mail, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Panelist {
  id: string;
  name: string;
  position: string;
  image: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  description: string;
  email: string;
  session: string;
  rank: string;
  contact: string;
}

export default function CurrentPanelists() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await fetch("/api/panelists");
        if (!response.ok) {
          throw new Error("Failed to fetch panelists");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response: Expected an array");
        }

        // Sort and relabel as admin/panelist
        const sorted = [...data].sort((a: Panelist, b: Panelist) =>
          a.id.localeCompare(b.id)
        );

        const relabeled = sorted.map((panelist, index) => {
          if (index < 3) {
            return { ...panelist, id: `admin-${index + 1}` };
          } else {
            return { ...panelist, id: `panelist-${index - 2}` };
          }
        });

        setPanelists(relabeled.slice(0, 3)); // Only show first 3
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="py-24" id="panelists">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <motion.div
          className="mb-16 text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Admin Panelists
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Meet our top 3 current admin panelists
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Card
                  key={i}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="h-24 w-24 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-16 w-full" />
                      <div className="flex justify-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {panelists.map((panelist) => (
              <motion.div key={panelist.id} variants={item}>
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 group-hover:border-primary transition-colors duration-300 mb-4">
                        <AvatarImage
                          src={
                            panelist.image ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt={panelist.name}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <AvatarFallback>
                          {panelist.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center space-y-1 mb-3">
                        <h3 className="text-xl font-medium">{panelist.name}</h3>
                        <Badge variant="secondary" className="font-normal">
                          {panelist.position}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                        {panelist.description}
                      </p>

                      <div className="w-full grid grid-cols-2 gap-2 text-xs mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">
                            Session:
                          </span>
                          <span className="font-medium">
                            {panelist.session}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Rank:</span>
                          <span className="font-medium">{panelist.rank}</span>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-2 mt-2">
                        {panelist.facebook && (
                          <a
                            href={panelist.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                        {panelist.instagram && (
                          <a
                            href={panelist.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {panelist.linkedin && (
                          <a
                            href={panelist.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {panelist.contact && (
                          <a
                            href={`mailto:${panelist.contact}`}
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA to view all panelists */}
        <div className="flex justify-center mt-12">
          <Button onClick={() => router.push("/panelists")} size="lg">
            View All Panelists
          </Button>
        </div>
      </div>
      <Separator className="my-12 max-w-6xl mx-auto" />
    </section>
  );
}
