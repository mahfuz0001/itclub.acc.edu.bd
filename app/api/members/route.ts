import { NextRequest, NextResponse } from "next/server";
import { collection, query, getDocs } from "firebase/firestore";
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
  const rateLimit = checkRateLimit(`members-${clientIp}`, 10, 60000); // 10 requests per minute
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
          'X-RateLimit-Limit': '10',
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

      const q = query(collection(db, "members"));
      const querySnapshot = await getDocs(q);
      
      const members = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Remove sensitive fields if any
        const { internalNotes, ...publicData } = data;
        return {
          id: doc.id,
          ...publicData,
        };
      });

      return members;
    },
    "Fetching members from API"
  );

  if (result === null) {
    return NextResponse.json(
      { 
        error: "Failed to fetch members. Please try again later.",
        code: "FETCH_ERROR"
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result, {
    headers: {
      'X-RateLimit-Limit': '10',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // Cache for 5 minutes
    }
  });
}
