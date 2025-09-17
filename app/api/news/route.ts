import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
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
  const rateLimit = checkRateLimit(`news-${clientIp}`, 20, 60000); // 20 requests per minute
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
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  }

  const result = await withErrorHandling(
    async () => {
      if (!db) {
        throw new Error("Database not initialized");
      }

      const { searchParams } = new URL(request.url);
      const limitParam = searchParams.get("limit");
      
      // Validate and sanitize limit parameter
      let newsLimit = 10; // default
      if (limitParam) {
        const parsedLimit = Number.parseInt(limitParam, 10);
        if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
          throw new Error("Invalid limit parameter. Must be between 1 and 50.");
        }
        newsLimit = parsedLimit;
      }

      const newsQuery = query(
        collection(db, "news"),
        orderBy("publishedAt", "desc"),
        limit(newsLimit)
      );
      
      const querySnapshot = await getDocs(newsQuery);
      const news = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Remove sensitive fields if any
        const { internalNotes, authorEmail, ...publicData } = data;
        return {
          id: doc.id,
          ...publicData,
        };
      });

      return { news };
    },
    "Fetching news from API"
  );

  if (result === null) {
    return NextResponse.json(
      { 
        error: "Failed to fetch news. Please try again later.",
        code: "FETCH_ERROR"
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result, {
    headers: {
      'X-RateLimit-Limit': '20',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'Cache-Control': 'public, max-age=180, stale-while-revalidate=30', // Cache for 3 minutes
    }
  });
}
