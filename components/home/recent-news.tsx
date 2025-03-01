"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
}

export default function RecentNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await fetch("/api/news?limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();

        console.log("Fetched news data:", data);

        setNews(data.news || []);
      } catch (error) {
        console.error("Error fetching recent news:", error);
        toast({
          title: "Error",
          description: "Failed to load recent news. Please try again later.",
          variant: "destructive",
        });
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNews();
  }, [toast]);

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
            Recent News
          </h2>
          <p className="mx-auto max-w-2xl mt-4 text-xl text-[#94a3b8]">
            Stay updated with the latest happenings and announcements from our
            IT club
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(3)
                .fill(null)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/50 backdrop-blur-sm border-none shadow-lg"
                  >
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-28" />
                    </CardFooter>
                  </Card>
                ))
            : (news || []).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardDescription className="text-[#3b82f6]/80">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </CardDescription>
                      <CardTitle className="text-xl font-bold">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-[#94a3b8]">
                        {item.content.substring(0, 100)}...{" "}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full rounded-full hover:bg-[#3b82f6] hover:text-[#0f172a] transition-colors duration-300"
                      >
                        <Link href={`/news/${item.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            asChild
            className="rounded-full px-8 py-6 text-lg font-semibold bg-[#3b82f6] text-[#0f172a] hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/news">View All News</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
