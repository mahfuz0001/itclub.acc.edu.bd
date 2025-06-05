"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface Panelist {
  id: string;
  name: string;
  email: string;
  image: string;
  session: string;
  rank: string;
  description: string;
  contact: string;
  facebook: string;
  instagram: string;
  linkedin?: string;
}

export default function PublicPanelistsPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanelists = async () => {
      const querySnapshot = await getDocs(collection(db, "panelists"));
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Panelist[];

      // Sort by ID (or whatever logic ensures order)
      const sorted = [...fetched].sort((a, b) => a.id.localeCompare(b.id));

      // Assign custom IDs
      const updated = sorted.map((panelist, index) => {
        if (index < 3) {
          return { ...panelist, id: `admin-${index + 1}` };
        } else {
          return { ...panelist, id: `panelist-${index - 2}` };
        }
      });

      setPanelists(updated);
      setLoading(false);
    };

    fetchPanelists();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="min-h-screen text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Our Panelists</h1>
        <p className="text-gray-400">
          Celebrating the minds behind every session
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {panelists.map((panelist, index) => {
            const isAdmin = index < 3;

            return (
              <motion.div key={panelist.id} variants={item}>
                <Card
                  className={`bg-card/50 backdrop-blur-sm border ${
                    isAdmin ? "border-yellow-400" : "border-border/50"
                  } shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <Avatar
                        className={`h-24 w-24 border-2 ${
                          isAdmin ? "border-yellow-400" : "border-primary/20"
                        } group-hover:border-primary transition-colors duration-300 mb-4`}
                      >
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
                        <div className="flex flex-col items-center space-y-1">
                          <Badge variant="secondary" className="font-normal">
                            {panelist.rank}
                          </Badge>
                          {/* {isAdmin && (
                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                              Administrator
                            </Badge>
                          )} */}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                        {panelist.description}
                      </p>

                      <div className="flex justify-center space-x-2 mt-2">
                        {panelist.facebook && (
                          <a
                            href={panelist.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                            aria-label="Facebook"
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
                            aria-label="Instagram"
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
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {panelist.contact && (
                          <a
                            href={`mailto:${panelist.contact}`}
                            className="rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                            aria-label="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
