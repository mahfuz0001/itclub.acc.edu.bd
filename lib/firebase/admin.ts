import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "./config"
import type { DashboardStats } from "@/types/admin"

export async function fetchDashboardStats(adminEmail: string): Promise<DashboardStats> {
  try {
    // Get total members count
    const membersQuery = query(
      collection(db, "applications"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    )
    const membersSnapshot = await getDocs(membersQuery)
    const totalMembers = membersSnapshot.size

    // Get pending applications
    const applicationsQuery = query(
      collection(db, "applications"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
    )
    const applicationsSnapshot = await getDocs(applicationsQuery)
    const pendingApplications = applicationsSnapshot.size

    // Get recent applications
    const recentApplicationsQuery = query(collection(db, "applications"), orderBy("createdAt", "desc"), limit(3))
    const recentApplicationsSnapshot = await getDocs(recentApplicationsQuery)
    const recentApplications = recentApplicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get news count
    const newsSnapshot = await getDocs(collection(db, "news"))
    const newsCount = newsSnapshot.size

    // Get recent news
    const recentNewsQuery = query(collection(db, "news"), orderBy("publishedAt", "desc"), limit(3))
    const recentNewsSnapshot = await getDocs(recentNewsQuery)
    const recentNews = recentNewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get gallery count
    const gallerySnapshot = await getDocs(collection(db, "gallery"))
    const galleryCount = gallerySnapshot.size

    return {
      totalMembers,
      pendingApplications,
      recentApplications,
      newsCount,
      recentNews,
      galleryCount,
      adminEmail,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics. Please try again later.")
  }
}

