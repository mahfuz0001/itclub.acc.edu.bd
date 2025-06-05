"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
      try {
        const querySnapshot = await getDocs(collection(db, "panelists"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Panelist[];
        setPanelists(data);
      } catch (error) {
        console.error("Error loading panelists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelists();
  }, []);

  return (
    <section className="min-h-screen bg-[#2C2C2C] text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-[#F7374F] mb-2">
          Our Panelists
        </h1>
        <p className="text-gray-300">
          Meet the peoples who kept the club alive
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {panelists.map((panelist) => (
            <Card
              key={panelist.id}
              className="bg-[#522546]/70 border-none text-white hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardHeader className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-24 w-24 ring-4 ring-[#F7374F]">
                  <AvatarImage src={panelist.image} alt={panelist.name} />
                  <AvatarFallback>{panelist.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{panelist.name}</CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-[#88304E] text-white text-xs"
                >
                  {panelist.session}
                </Badge>
                <p className="text-sm text-gray-300">{panelist.rank}</p>
              </CardHeader>

              <CardContent className="px-6 pb-6 space-y-2 text-sm text-gray-200">
                <p>{panelist.description}</p>
                <p className="text-xs text-gray-400">
                  Contact: {panelist.contact}
                </p>

                <div className="flex gap-3 mt-2">
                  {panelist.facebook && (
                    <Link href={panelist.facebook} target="_blank">
                      <img
                        src="/icons/facebook.svg"
                        alt="fb"
                        className="h-5 hover:scale-110"
                      />
                    </Link>
                  )}
                  {panelist.instagram && (
                    <Link href={panelist.instagram} target="_blank">
                      <img
                        src="/icons/instagram.svg"
                        alt="ig"
                        className="h-5 hover:scale-110"
                      />
                    </Link>
                  )}
                  {panelist.linkedin && (
                    <Link href={panelist.linkedin} target="_blank">
                      <img
                        src="/icons/linkedin.svg"
                        alt="li"
                        className="h-5 hover:scale-110"
                      />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
