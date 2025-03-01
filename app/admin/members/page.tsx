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
import { Loader2, Search, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  status: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  useEffect(() => {
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.batch.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    if (!user) return;

    try {
      let membersQuery;

      if (user.role === "panel" && user.assignedYear) {
        membersQuery = query(
          collection(db, "members"),
          where("batch", "==", user.assignedYear)
        );
      } else {
        membersQuery = collection(db, "members");
      }

      const querySnapshot = await getDocs(membersQuery);
      const fetchedMembers = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Member)
      );
      setMembers(fetchedMembers);
      setFilteredMembers(fetchedMembers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch members. Please try again.",
        variant: "destructive",
      });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Members</h1>
        {user?.role !== "panel" && (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add New Member
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-[#94a3b8]" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>{member.batch}</TableCell>
              <TableCell>{member.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateMemberStatus(member.id, "active")}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => updateMemberStatus(member.id, "inactive")}
                >
                  Deactivate
                </Button>
                {user?.role !== "panel" && (
                  <Button
                    variant="destructive"
                    onClick={() => deleteMember(member.id)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
