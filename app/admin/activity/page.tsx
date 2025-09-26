"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { getAdminActivity, getAuditLogs, type AuditLog, type AdminActivity } from "@/lib/firebase/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  Clock,
  User,
  Search,
  Filter,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminActivityPage() {
  const [activity, setActivity] = useState<AdminActivity | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchActivityData();
    }
  }, [user]);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const [activityData, logs] = await Promise.all([
        getAdminActivity(),
        getAuditLogs(100)
      ]);
      
      setActivity(activityData);
      setAuditLogs(logs);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesAdmin = filterAdmin === "all" || log.adminEmail === filterAdmin;
    const matchesSearch = searchTerm === "" || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAdmin && matchesSearch;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('view')) return <Eye className="h-4 w-4" />;
    if (action.includes('edit') || action.includes('update')) return <Edit className="h-4 w-4" />;
    if (action.includes('delete')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('export')) return <Download className="h-4 w-4" />;
    if (action.includes('login') || action.includes('logout')) return <Shield className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'destructive';
    if (action.includes('edit') || action.includes('update')) return 'default';
    if (action.includes('view')) return 'secondary';
    if (action.includes('create') || action.includes('approve')) return 'default';
    return 'outline';
  };

  const actionChartData = activity ? Object.entries(activity.actionsByType).map(([action, count]) => ({
    action: action.replace(/_/g, ' ').toUpperCase(),
    count
  })).slice(0, 10) : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Activity</h1>
          <p className="text-muted-foreground">
            Monitor and audit administrative actions
          </p>
        </div>
        <Button onClick={fetchActivityData}>
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activity?.totalActions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All administrative actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activity?.mostActiveAdmins.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrators with activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
            <Filter className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activity ? Object.keys(activity.actionsByType).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Different action categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {activity?.recentActions.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 20 actions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Actions by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Actions by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={actionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="action" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Active Admins */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity?.mostActiveAdmins.slice(0, 5).map((admin, index) => (
                <div key={admin.adminEmail} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{admin.adminEmail}</p>
                      <p className="text-sm text-muted-foreground">Administrator</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {admin.count} actions
                  </Badge>
                </div>
              ))}
              {(!activity?.mostActiveAdmins || activity.mostActiveAdmins.length === 0) && (
                <div className="py-8 text-center text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No admin activity recorded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterAdmin} onValueChange={setFilterAdmin}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Administrators</SelectItem>
                  {activity?.mostActiveAdmins.map(admin => (
                    <SelectItem key={admin.adminEmail} value={admin.adminEmail}>
                      {admin.adminEmail}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell>
                      {getActionIcon(log.action)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionColor(log.action)}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.adminEmail}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.target}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {log.targetId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {typeof log.details === 'object' ? 
                          Object.entries(log.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          )) : 
                          String(log.details)
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(log.timestamp), 'PPpp')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No audit logs found</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}