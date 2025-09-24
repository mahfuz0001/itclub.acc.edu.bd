"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, AlertCircle, Search, Users, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SITE_CONFIG } from "@/constants/site";

interface Application {
  id: string;
  name: string;
  email: string;
  stream: string;
  year: string;
  status: "pending" | "approved" | "rejected";
  rollNumber?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      let applicationsQuery;

      if (user.role === "panel" && user.assignedYear) {
        applicationsQuery = query(
          collection(db, "applications"),
          where("year", "==", user.assignedYear)
        );
      } else {
        applicationsQuery = collection(db, "applications");
      }

      const querySnapshot = await getDocs(applicationsQuery);
      const fetchedApplications = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Application)
      );
      setApplications(fetchedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const sendNotificationEmail = async (
    application: Application,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: status === "approved" ? "welcome" : "rejection",
          to: application.email,
          memberName: application.name,
          messengerGroupLink: SITE_CONFIG.groupChats.messenger,
          instagramGroupLink: SITE_CONFIG.groupChats.instagram,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send notification email:', error);
      // Don't throw the error - we don't want email failures to prevent status updates
      toast({
        title: "Warning",
        description: `Application ${status} successfully, but failed to send notification email.`,
        variant: "default",
      });
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      // Find the application to get the details for email
      const application = applications.find(app => app.id === id);
      if (!application) {
        throw new Error("Application not found");
      }

      // Update the status in the database first
      await updateDoc(doc(db, "applications", id), { status: newStatus });
      
      // Update the local state
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );

      // Send notification email
      await sendNotificationEmail(application, newStatus);

      toast({
        title: "Success",
        description: `Application ${
          newStatus === "approved" ? "approved" : "rejected"
        } successfully. Notification email sent.`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: "approved" | "rejected") => {
    if (selectedApplications.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one application.",
        variant: "destructive",
      });
      return;
    }

    setBulkActionLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const selectedApps = Array.from(selectedApplications);
      
      for (const appId of selectedApps) {
        try {
          const application = applications.find(app => app.id === appId);
          if (!application) continue;

          // Update the status in the database
          await updateDoc(doc(db, "applications", appId), { status: newStatus });
          
          // Send notification email
          await sendNotificationEmail(application, newStatus);
          
          successCount++;
        } catch (error) {
          console.error(`Error updating application ${appId}:`, error);
          errorCount++;
        }
      }

      // Update the local state for successful updates
      setApplications(applications.map((app) =>
        selectedApplications.has(app.id) && (successCount > 0)
          ? { ...app, status: newStatus }
          : app
      ));

      // Clear selection
      setSelectedApplications(new Set());

      toast({
        title: "Bulk Action Completed",
        description: `${successCount} applications ${newStatus} successfully. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
      });
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast({
        title: "Error",
        description: "Failed to complete bulk action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleApplicationSelection = (appId: string) => {
    const newSelection = new Set(selectedApplications);
    if (newSelection.has(appId)) {
      newSelection.delete(appId);
    } else {
      newSelection.add(appId);
    }
    setSelectedApplications(newSelection);
  };

  const toggleAllApplications = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Manage and review student applications
            </CardDescription>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">
                {applications.filter(app => app.status === "pending").length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">
                {applications.filter(app => app.status === "approved").length}
              </div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-red-600">
                {applications.filter(app => app.status === "rejected").length}
              </div>
              <div className="text-gray-600">Rejected</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-800">
                {applications.length}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex relative">
            <Input
              placeholder="Search by name, email, or student ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedApplications.size > 0 && (
          <div className="flex items-center gap-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {selectedApplications.size} application(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleBulkStatusUpdate("approved")}
                disabled={bulkActionLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Approve Selected
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkStatusUpdate("rejected")}
                disabled={bulkActionLoading}
                variant="destructive"
              >
                <UserX className="w-4 h-4 mr-2" />
                Reject Selected
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedApplications(new Set())}
                variant="outline"
                disabled={bulkActionLoading}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No applications found.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredApplications.length > 0 && selectedApplications.size === filteredApplications.length}
                      onCheckedChange={toggleAllApplications}
                      aria-label="Select all applications"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedApplications.has(application.id)}
                        onCheckedChange={() => toggleApplicationSelection(application.id)}
                        aria-label={`Select ${application.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {application.name}
                    </TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {application.rollNumber || "N/A"}
                    </TableCell>
                    <TableCell>{application.stream}</TableCell>
                    <TableCell>{application.year}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      {application.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(application.id, "approved")
                            }
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(application.id, "rejected")
                            }
                            variant="destructive"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
