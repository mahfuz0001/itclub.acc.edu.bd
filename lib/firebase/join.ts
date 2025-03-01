import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function submitJoinApplication(formData: any) {
  try {
    const applicationData = {
      ...formData,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "applications"),
      applicationData
    );

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting application:", error);
    throw new Error("Failed to submit application. Please try again later.");
  }
}
