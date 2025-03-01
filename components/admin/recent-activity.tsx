"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, FileText, Image } from "lucide-react";

export function RecentActivity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
        <Link href="/admin/activity">
          <a className="text-sm text-[#94a3b8]">View all</a>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Applications
          </CardTitle>
          <UserPlus className="h-4 w-4 text-[#94a3b8]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-[#94a3b8]">new applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent News</CardTitle>
          <FileText className="h-4 w-4 text-[#94a3b8]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-[#94a3b8]">new articles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gallery Updates</CardTitle>
          <Image className="h-4 w-4 text-[#94a3b8]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-[#94a3b8]">new photos</p>
        </CardContent>
      </Card>
    </div>
  );
}
