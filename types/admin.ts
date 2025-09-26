import type { NewsItem } from "./news"
import type { Member } from "./member"

export interface DashboardStats {
  totalMembers: number
  pendingApplications: number
  recentApplications: Partial<Member>[]
  newsCount: number
  recentNews: Partial<NewsItem>[]
  galleryCount: number
  adminEmail: string
  membersByBatch: { batch: string; count: number }[]
  membersByStream: { stream: string; count: number }[]
  memberGrowth: { month: string; members: number }[]
  activeMembers: number
  inactiveMembers: number
  totalPanelists: number
}

export interface MemberAnalytics {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  membersByBatch: { batch: string; count: number }[]
  membersByStream: { stream: string; count: number }[]
  memberGrowth: { month: string; members: number }[]
  recentJoins: Member[]
}

