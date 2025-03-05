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
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "../ui/separator";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
}

export default function RecentNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    "All",
    ...new Set(news.map((item, index) => item.category)),
  ];
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await fetch("/api/news?limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();

        console.log("Fetched news data:", data);

        setNews(
          (data.news || []).map((item: any) => ({
            ...item,
            publishedAt: item.publishedAt?.seconds
              ? new Date(item.publishedAt.seconds * 1000).toLocaleDateString()
              : "Unknown Date",
          }))
        );
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

  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All" ? news : news.filter((item) => item.category === filter);

  return (
    <>
      <section className="py-20 bg-background" id="news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Recent News
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stay up-to-date with the latest happenings in our club.
            </p>
          </motion.div>

          <div className="flex justify-center space-x-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {/* {(news || []).map((item, index) => ( */}
              {(filteredProjects || []).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    >
                      <p className="text-white text-center px-4">
                        {item.content}
                      </p>
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm font-medium text-primary mb-1">
                      {item.category} - {item.publishedAt}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <a
                      href="https://www.flowersandsaints.com.au"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      {/* <Separator className="my-12" /> */}
    </>
  );
}
