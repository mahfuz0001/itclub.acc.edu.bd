"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
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
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: string;
  name: string;
  email: string;
  stream: string;
  batch: string;
  status: string;
  rollNumber?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.stream.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || member.status === statusFilter) &&
        (batchFilter === "all" || member.batch === batchFilter)
    );
  }, [members, searchTerm, statusFilter, batchFilter]);

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;

    try {
      let membersQuery;

      if (user.role === "panel" && user.assignedYear) {
        membersQuery = query(
          collection(db, "applications"),
          where("status", "==", "approved"),
          where("year", "==", user.assignedYear)
        );
      } else {
        membersQuery = query(
          collection(db, "applications"),
          where("status", "==", "approved")
        );
      }

      const querySnapshot = await getDocs(membersQuery);
      const fetchedMembers = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            stream: doc.data().stream,
            batch: doc.data().year,
            status: doc.data().status,
            rollNumber: doc.data().rollNumber,
          } as Member)
      );

      setMembers(fetchedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (memberId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "members", memberId), { status: newStatus });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
      toast({
        title: "Success",
        description: `Member status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating member status:", error);
      toast({
        title: "Error",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (memberId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, "members", memberId));
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
        toast({
          title: "Success",
          description: "Member deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting member:", error);
        toast({
          title: "Error",
          description: "Failed to delete member. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading members...</span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              Members
              <Badge variant="outline" className="text-sm">
                {members.length} Total
              </Badge>
            </CardTitle>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600">
                {members.filter(member => member.status === "active" || member.status === "approved").length}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-600">
                {members.filter(member => member.status === "inactive").length}
              </div>
              <div className="text-gray-600">Inactive</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">
                {[...new Set(members.map(m => m.batch))].length}
              </div>
              <div className="text-gray-600">Batches</div>
            </div>
          </div>
        </div>
        {user?.role !== "panel" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              {/* Add form fields for new member here */}
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center w-full md:w-auto">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              placeholder="Search members by name, email, ID, stream, or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {[...new Set(members.map(member => member.batch))].sort().map(batch => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {member.rollNumber || "N/A"}
                  </TableCell>
                  <TableCell>{member.stream}</TableCell>
                  <TableCell>{member.batch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateMemberStatus(
                          member.id,
                          member.status === "active" ? "inactive" : "active"
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user?.role !== "panel" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
