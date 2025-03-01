import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "./config";
import type { NewsItem } from "@/types/news";

export async function fetchRecentNews(count = 3): Promise<NewsItem[]> {
  try {
    const newsQuery = query(
      collection(db, "news"),
      where("published", "==", true),
      orderBy("publishedAt", "desc"),
      limit(count)
    );

    const snapshot = await getDocs(newsQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as NewsItem)
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news. Please try again later.");
  }
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  try {
    const docRef = doc(db, "news", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as NewsItem;
    }

    return null;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw new Error("Failed to fetch news article. Please try again later.");
  }
}

export async function addNewsItem(
  newsItem: Omit<NewsItem, "id" | "publishedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "news"), {
      ...newsItem,
      publishedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding news item:", error);
    throw new Error("Failed to add news item. Please try again later.");
  }
}

export async function updateNewsItem(
  id: string,
  newsItem: Partial<NewsItem>
): Promise<void> {
  try {
    await updateDoc(doc(db, "news", id), newsItem);
  } catch (error) {
    console.error("Error updating news item:", error);
    throw new Error("Failed to update news item. Please try again later.");
  }
}

export async function deleteNewsItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "news", id));
  } catch (error) {
    console.error("Error deleting news item:", error);
    throw new Error("Failed to delete news item. Please try again later.");
  }
}

export async function getBatchedNews(
  startAfterId: string,
  count = 6
): Promise<NewsItem[]> {
  try {
    const startAfterDoc = await getDoc(doc(db, "news", startAfterId));

    const baseQuery = query(
      collection(db, "news"),
      where("published", "==", true),
      orderBy("publishedAt", "desc"),
      limit(count)
    );

    const newsQuery = startAfterDoc.exists()
      ? query(baseQuery, startAfter(startAfterDoc))
      : baseQuery;

    const snapshot = await getDocs(newsQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as NewsItem)
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news. Please try again later.");
  }
}
