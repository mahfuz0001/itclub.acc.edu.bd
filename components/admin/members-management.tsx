"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMembersByBatch, updateMemberStatus } from "@/lib/firebase/members";
import { useAuth } from "@/lib/firebase/auth-provider";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  batch: string;
  department: string;
  status: string;
  createdAt: string;
}

export function MembersManagement() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userBatch = user?.assignedYear || "";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const batchToFetch = isAdmin ? "" : userBatch;
        const membersData = await getMembersByBatch(batchToFetch);

        const approvedMembers = membersData.filter(
          (m) => m.status === "approved"
        );
        const pendingApplications = membersData.filter(
          (m) => m.status === "pending"
        );

        setMembers(approvedMembers);
        setApplications(pendingApplications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    };

    if (session) {
      fetchMembers();
    }
  }, [session, isAdmin, userBatch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateMemberStatus(id, newStatus);

      if (newStatus === "approved") {
        const applicant = applications.find((app) => app.id === id);
        if (applicant) {
          setApplications(applications.filter((app) => app.id !== id));
          setMembers([...members, { ...applicant, status: "approved" }]);
        }
      } else if (newStatus === "rejected") {
        setApplications(applications.filter((app) => app.id !== id));
      }
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  // Filter members based on search term
  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName} ${member.email} ${member.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter((app) =>
    `${app.firstName} ${app.lastName} ${app.email} ${app.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Members Management</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Manage all club members and applications"
              : `Manage members and applications for batch ${userBatch}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
            <TabsContent value="applications">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          {application.firstName} {application.lastName}
                        </TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.batch}</TableCell>
                        <TableCell>{application.department}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application.id, "approved")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(application.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="members">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.batch}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
