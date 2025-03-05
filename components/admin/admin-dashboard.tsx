"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardStats } from "@/lib/firebase/admin";
import type { DashboardStats } from "@/types/admin";
import { AlertCircle, Users, UserPlus, FileText, Image } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/firebase/auth-provider";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const statsData = await fetchDashboardStats(user?.email || "");
        setStats(statsData);
        setError(null);
        // console.log("Fetched Stats:", statsData);

      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError(
          "Failed to load dashboard statistics. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getStats();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#94a3b8]">
          Welcome back,{" "}
          {user?.displayName || user?.email?.split("@")[0] || "Admin"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-[#94a3b8]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalMembers || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              New Applications
            </CardTitle>
            <UserPlus className="h-4 w-4 text-[#94a3b8]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.pendingApplications || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-[#94a3b8]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.newsCount || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Gallery Images
            </CardTitle>
            <Image className="h-4 w-4 text-[#94a3b8]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.galleryCount || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Recently submitted membership applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
              </div>
            ) : stats?.recentApplications &&
              stats.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {stats.recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-[#94a3b8]">
                      {app.department} • {app?.year ? new Date(app.year).toLocaleDateString() : "N/A"}

                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/applications/${app.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/applications">View All Applications</Link>
                </Button>
              </div>
            ) : (
              <div className="py-6 text-center text-[#94a3b8]">
                No recent applications
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent News</CardTitle>
            <CardDescription>Recently published news articles</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
              </div>
            ) : stats?.recentNews && stats.recentNews.length > 0 ? (
              <div className="space-y-4">
                {stats.recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{news.title}</div>
                      <div className="text-sm text-[#94a3b8]">
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString() : "N/A"}

                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/news/${news.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/news">Manage News</Link>
                </Button>
              </div>
            ) : (
              <div className="py-6 text-center text-[#94a3b8]">
                No recent news articles
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
