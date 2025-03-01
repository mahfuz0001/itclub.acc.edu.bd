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

interface Application {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  status: "pending" | "approved" | "rejected";
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateDoc(doc(db, "applications", id), { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Applications</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.name}</TableCell>
              <TableCell>{application.email}</TableCell>
              <TableCell>{application.department}</TableCell>
              <TableCell>{application.year}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    application.status === "pending"
                      ? "outline"
                      : application.status === "approved"
                      ? "default"
                      : "destructive"
                  }
                >
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                {application.status === "pending" && (
                  <>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(application.id, "approved")
                      }
                      className="mr-2"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(application.id, "rejected")
                      }
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
