import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "./config"
import type { DashboardStats } from "@/types/admin"
import { startOfMonth, format, subMonths } from "date-fns"

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
    const membersData = membersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as any[]

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

    // Get panelists count
    const panelistsQuery = query(collection(db, "adminUsers"), where("role", "==", "panel"))
    const panelistsSnapshot = await getDocs(panelistsQuery)
    const totalPanelists = panelistsSnapshot.size

    // Calculate member statistics
    const activeMembers = membersData.filter((member: any) => 
      member.status === "active" || member.status === "approved"
    ).length
    const inactiveMembers = totalMembers - activeMembers

    // Group members by batch
    const membersByBatch = membersData.reduce((acc: { [key: string]: number }, member: any) => {
      const batch = member.year || member.batch || "Unknown"
      acc[batch] = (acc[batch] || 0) + 1
      return acc
    }, {})

    const membersByBatchArray = Object.entries(membersByBatch).map(([batch, count]) => ({
      batch,
      count: count as number
    })).sort((a, b) => a.batch.localeCompare(b.batch))

    // Group members by stream
    const membersByStream = membersData.reduce((acc: { [key: string]: number }, member: any) => {
      const stream = member.stream || "Unknown"
      acc[stream] = (acc[stream] || 0) + 1
      return acc
    }, {})

    const membersByStreamArray = Object.entries(membersByStream).map(([stream, count]) => ({
      stream,
      count: count as number
    }))

    // Calculate member growth over last 6 months
    const memberGrowth = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i))
      const monthEnd = startOfMonth(subMonths(new Date(), i - 1))
      
      const monthMembers = membersData.filter((member: any) => {
        if (!member.createdAt) return false
        const memberDate = new Date(member.createdAt)
        return memberDate >= monthStart && memberDate < monthEnd
      }).length

      memberGrowth.push({
        month: format(monthStart, "MMM yyyy"),
        members: monthMembers
      })
    }

    return {
      totalMembers,
      pendingApplications,
      recentApplications,
      newsCount,
      recentNews,
      galleryCount,
      adminEmail,
      membersByBatch: membersByBatchArray,
      membersByStream: membersByStreamArray,
      memberGrowth,
      activeMembers,
      inactiveMembers,
      totalPanelists,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics. Please try again later.")
  }
}

