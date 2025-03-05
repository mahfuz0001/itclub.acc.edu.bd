import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  stream: string;
  status: string;
  createdAt: string;
}

export async function getAllApplications(sortOrder: "asc" | "desc") {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(applicationsRef, orderBy("createdAt", sortOrder));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        stream: data.stream || "",
        status: data.status || "pending",
        createdAt: data.createdAt || "",
      } as Application;
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: string
) {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, { status: newStatus });
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}
