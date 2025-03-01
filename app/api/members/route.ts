import { NextResponse } from "next/server";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET() {
  try {
    const q = query(collection(db, "members"));
    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
