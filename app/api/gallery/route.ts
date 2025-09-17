import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { 
  getSafeErrorMessage, 
  logError, 
  withErrorHandling 
} from "@/lib/utils/error-handler";
import { checkRateLimit } from "@/lib/utils/validation";

export async function GET(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  // Rate limiting
  const rateLimit = checkRateLimit(`gallery-${clientIp}`, 15, 60000); // 15 requests per minute
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '15',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  }

  const result = await withErrorHandling(
    async () => {
      if (!db || !storage) {
        throw new Error("Database or storage not initialized");
      }

      const { searchParams } = new URL(request.url);
      const limitParam = searchParams.get("limit");
      
      // Validate and sanitize limit parameter
      let galleryLimit = 20; // default
      if (limitParam) {
        const parsedLimit = Number.parseInt(limitParam, 10);
        if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          throw new Error("Invalid limit parameter. Must be between 1 and 100.");
        }
        galleryLimit = parsedLimit;
      }

      const galleryQuery = query(collection(db, "gallery"), limit(galleryLimit));
      const querySnapshot = await getDocs(galleryQuery);

      const gallery = await Promise.allSettled(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imagePath = data.imagePath;

          if (!imagePath || typeof imagePath !== 'string') {
            logError(new Error(`Missing or invalid imagePath for document ${doc.id}`), "Gallery image processing");
            return null;
          }

          try {
            const imageUrl = await getDownloadURL(ref(storage, imagePath));
            return { 
              id: doc.id, 
              caption: data.caption || '', 
              imageUrl,
              uploadedAt: data.uploadedAt || null
            };
          } catch (err) {
            logError(err, `Failed to get image URL for ${doc.id}`);
            return null;
          }
        })
      );

      // Filter out failed promises and null results
      const validGalleryItems = gallery
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => (result as PromiseFulfilledResult<any>).value);

      return validGalleryItems;
    },
    "Fetching gallery items from API"
  );

  if (result === null) {
    return NextResponse.json(
      { 
        error: "Failed to fetch gallery items. Please try again later.",
        code: "FETCH_ERROR"
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result, {
    headers: {
      'X-RateLimit-Limit': '15',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=120', // Cache for 10 minutes
    }
  });
}
