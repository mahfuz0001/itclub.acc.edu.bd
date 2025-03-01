import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./config";
import type { Member } from "@/types/member";

export async function fetchMembers(): Promise<Member[]> {
  try {
    const membersQuery = query(
      collection(db, "members"),
      orderBy("name", "asc")
    );

    const snapshot = await getDocs(membersQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Member)
    );
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members. Please try again later.");
  }
}

export async function fetchMembersByYear(year: string): Promise<Member[]> {
  try {
    const membersQuery = query(
      collection(db, "members"),
      where("batch", "==", year),
      orderBy("name", "asc")
    );

    const snapshot = await getDocs(membersQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Member)
    );
  } catch (error) {
    console.error("Error fetching members by year:", error);
    throw new Error("Failed to fetch members. Please try again later.");
  }
}

export async function submitMemberApplication(data: Member) {
  try {
    await addDoc(collection(db, "applications"), data);
  } catch (error) {
    console.error("Error submitting member application:", error);
    throw new Error("Failed to submit application. Please try again later.");
  }
}

export async function updateMemberStatus(id: string, status: string) {
  try {
    await addDoc(collection(db, "members"), { id, status });
  } catch (error) {
    console.error("Error updating member status:", error);
    throw new Error("Failed to update member status. Please try again later.");
  }
}

export async function deleteMember(id: string) {
  try {
    await addDoc(collection(db, "members"), { id });
  } catch (error) {
    console.error("Error deleting member:", error);
    throw new Error("Failed to delete member. Please try again later.");
  }
}

export async function getMembersByBatch(batch: string): Promise<Member[]> {
  try {
    const membersQuery = query(
      collection(db, "members"),
      where("batch", "==", batch),
      orderBy("name", "asc")
    );

    const snapshot = await getDocs(membersQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Member)
    );
  } catch (error) {
    console.error("Error fetching members by batch:", error);
    throw new Error("Failed to fetch members. Please try again later.");
  }
}
