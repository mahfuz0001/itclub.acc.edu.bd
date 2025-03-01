import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "./config";
import type { Panelist } from "@/types/panelist";

export async function fetchPanelists(): Promise<Panelist[]> {
  try {
    const panelistsQuery = query(
      collection(db, "panelists"),
      orderBy("order", "asc")
    );

    const snapshot = await getDocs(panelistsQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Panelist)
    );
  } catch (error) {
    console.error("Error fetching panelists:", error);
    throw new Error("Failed to fetch panelists. Please try again later.");
  }
}

export async function getPanelists() {
  const panelistsQuery = query(
    collection(db, "panelists"),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(panelistsQuery);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Panelist)
  );
}
