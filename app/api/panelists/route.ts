import { NextResponse } from "next/server";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET() {
  try {
    const panelistsQuery = query(collection(db, "panelists"));

    const querySnapshot = await getDocs(panelistsQuery);
    const panelists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log("Fetched panelists:", panelists);

    return NextResponse.json(panelists);
  } catch (error) {
    console.error("Error fetching panelists:", error);
    return NextResponse.json(
      { error: "Failed to fetch panelists" },
      { status: 500 }
    );
  }
}
