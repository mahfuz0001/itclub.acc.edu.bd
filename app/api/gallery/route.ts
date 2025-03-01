import { NextResponse } from "next/server";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";
import { getDownloadURL, ref } from "firebase/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const galleryLimit = limitParam ? Number.parseInt(limitParam, 10) : 20;

    const galleryQuery = query(collection(db, "gallery"), limit(galleryLimit));
    const querySnapshot = await getDocs(galleryQuery);

    const gallery = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imagePath = data.imagePath;

        if (!imagePath) {
          console.warn(`Skipping document ${doc.id} due to missing imagePath`);
          return null;
        }

        try {
          const imageUrl = await getDownloadURL(ref(storage, imagePath));
          return { id: doc.id, caption: data.caption, imageUrl };
        } catch (err) {
          console.error(`Failed to get image URL for ${doc.id}:`, err);
          return null;
        }
      })
    );

    return NextResponse.json(gallery.filter((item) => item !== null));
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
