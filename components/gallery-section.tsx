"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const galleryImages = [
  {
    id: "1",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Annual Hackathon 2023",
    category: "Event",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Web Development Workshop",
    category: "Workshop",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Team Building Activity",
    category: "Activity",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Guest Speaker Session",
    category: "Talk",
  },
  {
    id: "5",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Award Ceremony",
    category: "Event",
  },
  {
    id: "6",
    src: "/placeholder.svg?height=800&width=1200",
    alt: "Coding Competition",
    category: "Competition",
  },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<null | {
    src: string;
    alt: string;
  }>(null);

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-16">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Gallery
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          Moments captured from our events, workshops, and activities.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage({ src: image.src, alt: image.alt })}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-center font-medium">{image.alt}</span>
              <span className="mt-2 rounded-full bg-white/20 px-3 py-1 text-xs">
                {image.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/gallery">
          <Button variant="outline" className="mt-6">
            View Full Gallery
          </Button>
        </Link>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {selectedImage && (
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
