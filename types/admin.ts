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
}

