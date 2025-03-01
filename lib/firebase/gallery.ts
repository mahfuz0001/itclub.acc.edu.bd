import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "./config"
import type { GalleryImage } from "@/types/gallery"

export async function fetchGalleryImages(count = 6): Promise<GalleryImage[]> {
  try {
    const galleryQuery = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(count))

    const snapshot = await getDocs(galleryQuery)

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as GalleryImage,
    )
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    throw new Error("Failed to fetch gallery images. Please try again later.")
  }
}

