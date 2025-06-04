"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/gallery?limit=12");
        if (!response.ok) throw new Error("Failed to fetch gallery images");

        const data = await response.json();
        const gallery = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              url: item.imageUrl,
              caption: item.caption,
            }))
          : [];

        setImages(gallery);
        setCurrentIndex(gallery.length >= 3 ? 1 : 0);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        toast({
          title: "Error",
          description: "Failed to load gallery images. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [toast]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (images.length <= 3) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= images.length - 2 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 1 ? images.length - 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 >= images.length - 1 ? 1 : prev + 1));
  };

  return (
    <>
      <section className="py-20 relative" id="gallery">
        <div className="container px-4 md:px-6">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-foreground bg-gradient-to-r from-primary to-secondary">
              Gallery
            </h2>
            <p className="mx-auto max-w-2xl mt-4 text-xl text-[#94a3b8]">
              Moments captured from our events and activities
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center gap-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="w-[320px] h-[320px] rounded-xl" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-400">No images found.</p>
          ) : (
            <div className="relative flex items-center justify-center max-w-7xl mx-auto h-[400px]">
              {/* Arrows */}
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm hover:bg-background"
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>

              <Button
                variant="ghost"
                onClick={handleNext}
                disabled={images.length <= 3}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm hover:bg-background"
              >
                <ChevronRight className="w-7 h-7" />
              </Button>

              {/* Carousel container */}
              <div className="overflow-hidden w-full max-w-6xl px-10">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: `-${(currentIndex - 1) * 360}px` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {images.map((img, i) => (
                    <div
                      key={img.id}
                      className={`relative h-[340px] shrink-0 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
                        i === currentIndex
                          ? "w-[400px] scale-100 opacity-100 z-10"
                          : "w-[320px] scale-95 opacity-60 z-0"
                      }`}
                    >
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={img.caption}
                        className="w-full h-full object-cover aspect-square"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

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
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <Separator className="my-12" />
    </>
  );
}
