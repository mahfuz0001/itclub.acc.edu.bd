"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBatchedNews } from "@/lib/firebase/news";

import { NewsItem } from "@/types/news";
import { Timestamp } from "firebase/firestore";

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getBatchedNews("3");
        setNews(newsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const placeholderNews: NewsItem[] = loading
    ? [
        {
          id: "1",
          title: "Annual Hackathon Announced",
          content:
            "Join us for our annual 24-hour coding challenge with amazing prizes.",
          summary:
            "A coding event where participants compete to solve challenges.",
          excerpt:
            "Join us for our annual 24-hour coding challenge with amazing prizes.",
          author: "Admin",
          publishedAt: "2022-10-01T00:00:00Z",
          published: true,
          imageUrl: "/placeholder.svg?height=400&width=600",
          slug: "annual-hackathon-announced",
          category: "Events",
          tags: ["hackathon", "coding", "challenge"],
          metaTitle: "Annual Hackathon Announced",
          metaDescription:
            "Join us for an exciting coding event with great prizes!",
        },
        {
          id: "2",
          title: "Web Development Workshop",
          content:
            "Learn the latest trends in web development with our expert instructors.",
          summary:
            "A workshop to help you learn modern web development technologies.",
          excerpt:
            "Learn the latest trends in web development with our expert instructors.",
          author: "Instructor",
          publishedAt: "2022-09-15T00:00:00Z",
          published: true,
          imageUrl: "/placeholder.svg?height=400&width=600",
          slug: "web-development-workshop",
          category: "Workshops",
          tags: ["web development", "workshop", "technology"],
          metaTitle: "Web Development Workshop",
          metaDescription:
            "Join our workshop to learn the latest web development trends.",
        },
        {
          id: "3",
          title: "New Partnership with Tech Giant",
          content:
            "We're excited to announce our new partnership with a leading tech company.",
          summary:
            "Our organization has partnered with a renowned tech giant to bring new opportunities.",
          excerpt:
            "We're excited to announce our new partnership with a leading tech company.",
          author: "PR Team",
          publishedAt: "2022-08-20T00:00:00Z",
          published: true,
          imageUrl: "/placeholder.svg?height=400&width=600",
          slug: "new-partnership-announced",
          category: "Announcements",
          tags: ["partnership", "technology", "business"],
          metaTitle: "New Partnership with Tech Giant",
          metaDescription:
            "A strategic partnership with a leading technology company to expand opportunities.",
        },
      ]
    : news;

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-16" id="news">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Latest News
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          Stay updated with the latest events, workshops, and achievements from
          our IT Club.
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {placeholderNews.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/news/${item.slug}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/news">
          <Button variant="outline" className="mt-4">
            View All News
          </Button>
        </Link>
      </div>
    </section>
  );
}
