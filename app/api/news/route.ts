import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const newsLimit = limitParam ? Number.parseInt(limitParam, 10) : 10;

    const newsQuery = query(
      collection(db, "news"),
      orderBy("publishedAt", "desc"),
      limit(newsLimit)
    );
    const querySnapshot = await getDocs(newsQuery);
    const news = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
