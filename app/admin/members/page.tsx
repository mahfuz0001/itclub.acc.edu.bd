"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { logAdminAction, AUDIT_ACTIONS } from "@/lib/firebase/audit";
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
import { 
  Loader2, 
  Search, 
  UserPlus, 
  Trash2, 
  Edit, 
  Eye,
  Download,
  Filter,
  MoreHorizontal,
  Users,
  TrendingUp,
  Calendar,
  FileSpreadsheet
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MemberDetailModal from "@/components/admin/member-detail-modal";
import { ErrorBoundary } from "@/components/error-boundary";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Member {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  stream: string;
  batch: string;
  year: string;
  status: string;
  rollNumber?: string;
  photoUrl?: string;
  createdAt?: string;
  // Contact Information
  phone?: string;
  address?: string;
  facebook?: string;
  // Academic Information
  section?: string;
  previousSchool?: string;
  // Skills and Experience
  techSkills?: string[];
  techSkillsOther?: string;
  leadershipSkills?: string[];
  leadershipOther?: string;
  thingsToLearn?: string[];
  achievements?: string;
  // Online Presence
  portfolio?: string;
  github?: string;
  freelancing?: string;
  website?: string;
  // Application Details
  reason?: string;
  agreeToTerms?: boolean;
  // Additional fields for existing members
  bio?: string;
  skills?: string[];
  position?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
        (batchFilter === "all" || member.batch === batchFilter || member.year === batchFilter) &&
        (streamFilter === "all" || member.stream === streamFilter)
    );
  }, [members, searchTerm, statusFilter, batchFilter, streamFilter]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const activeMembers = members.filter(m => m.status === "active" || m.status === "approved").length;
    const inactiveMembers = members.length - activeMembers;
    
    const streamDistribution = members.reduce((acc: { [key: string]: number }, member) => {
      acc[member.stream] = (acc[member.stream] || 0) + 1;
      return acc;
    }, {});

    const batchDistribution = members.reduce((acc: { [key: string]: number }, member) => {
      const batch = member.year || member.batch;
      acc[batch] = (acc[batch] || 0) + 1;
      return acc;
    }, {});

    const streamData = Object.entries(streamDistribution).map(([stream, count]) => ({
      stream,
      count
    }));

    const batchData = Object.entries(batchDistribution).map(([batch, count]) => ({
      batch,
      count
    })).sort((a, b) => a.batch.localeCompare(b.batch));

    return {
      totalMembers: members.length,
      activeMembers,
      inactiveMembers,
      totalBatches: Object.keys(batchDistribution).length,
      totalStreams: Object.keys(streamDistribution).length,
      streamData,
      batchData
    };
  }, [members]);

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
            name: doc.data().name || `${doc.data().firstName || ''} ${doc.data().lastName || ''}`.trim(),
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            stream: doc.data().stream,
            batch: doc.data().year || doc.data().batch,
            year: doc.data().year || doc.data().batch,
            status: doc.data().status,
            rollNumber: doc.data().rollNumber,
            photoUrl: doc.data().photoUrl,
            createdAt: doc.data().createdAt,
            // Contact Information
            phone: doc.data().phone,
            address: doc.data().address,
            facebook: doc.data().facebook,
            // Academic Information
            section: doc.data().section,
            previousSchool: doc.data().previousSchool,
            // Skills and Experience
            techSkills: doc.data().techSkills,
            techSkillsOther: doc.data().techSkillsOther,
            leadershipSkills: doc.data().leadershipSkills,
            leadershipOther: doc.data().leadershipOther,
            thingsToLearn: doc.data().thingsToLearn,
            achievements: doc.data().achievements,
            // Online Presence
            portfolio: doc.data().portfolio,
            github: doc.data().github,
            freelancing: doc.data().freelancing,
            website: doc.data().website,
            // Application Details
            reason: doc.data().reason,
            agreeToTerms: doc.data().agreeToTerms,
            // Additional fields for existing members
            bio: doc.data().bio,
            skills: doc.data().skills,
            position: doc.data().position,
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

  const updateMember = async (updatedMember: Member) => {
    try {
      const memberDoc = doc(db, "applications", updatedMember.id);
      await updateDoc(memberDoc, {
        name: updatedMember.name,
        email: updatedMember.email,
        stream: updatedMember.stream,
        year: updatedMember.year,
        batch: updatedMember.batch,
        rollNumber: updatedMember.rollNumber,
        // Contact Information
        phone: updatedMember.phone,
        address: updatedMember.address,
        facebook: updatedMember.facebook,
        // Academic Information
        section: updatedMember.section,
        previousSchool: updatedMember.previousSchool,
        // Skills and Experience
        techSkills: updatedMember.techSkills,
        techSkillsOther: updatedMember.techSkillsOther,
        leadershipSkills: updatedMember.leadershipSkills,
        leadershipOther: updatedMember.leadershipOther,
        thingsToLearn: updatedMember.thingsToLearn,
        achievements: updatedMember.achievements,
        // Online Presence
        portfolio: updatedMember.portfolio,
        github: updatedMember.github,
        website: updatedMember.website,
        freelancing: updatedMember.freelancing,
        // Application Details
        reason: updatedMember.reason,
        agreeToTerms: updatedMember.agreeToTerms,
        // Additional fields
        bio: updatedMember.bio,
      });
      
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      
      // Log the action
      if (user) {
        await logAdminAction(
          user.uid,
          user.email || '',
          AUDIT_ACTIONS.MEMBER_EDIT,
          'member',
          updatedMember.id,
          { memberName: updatedMember.name, memberEmail: updatedMember.email }
        );
      }
      
      toast({
        title: "Success",
        description: "Member information updated successfully",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description: "Failed to update member information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMemberStatus = async (memberId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "applications", memberId), { status: newStatus });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
      
      // Log the action
      if (user) {
        await logAdminAction(
          user.uid,
          user.email || '',
          AUDIT_ACTIONS.MEMBER_STATUS_CHANGE,
          'member',
          memberId,
          { oldStatus: members.find(m => m.id === memberId)?.status, newStatus }
        );
      }
      
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
        const memberToDelete = members.find(m => m.id === memberId);
        await deleteDoc(doc(db, "applications", memberId));
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
        
        // Log the action
        if (user && memberToDelete) {
          await logAdminAction(
            user.uid,
            user.email || '',
            AUDIT_ACTIONS.MEMBER_DELETE,
            'member',
            memberId,
            { memberName: memberToDelete.name, memberEmail: memberToDelete.email }
          );
        }
        
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

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Student ID", "Stream", "Batch", "Status", "Joined Date"];
    const csvContent = [
      headers.join(","),
      ...filteredMembers.map(member => [
        `"${member.name}"`,
        `"${member.email}"`,
        `"${member.rollNumber || 'N/A'}"`,
        `"${member.stream}"`,
        `"${member.year || member.batch}"`,
        `"${member.status}"`,
        `"${member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `members-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log the export action
    if (user) {
      logAdminAction(
        user.uid,
        user.email || '',
        AUDIT_ACTIONS.BULK_EXPORT,
        'members',
        'csv_export',
        { recordCount: filteredMembers.length, format: 'CSV' }
      );
    }
  };

  const viewMemberDetails = (member: Member) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
    
    // Log the view action
    if (user) {
      logAdminAction(
        user.uid,
        user.email || '',
        AUDIT_ACTIONS.MEMBER_VIEW,
        'member',
        member.id,
        { memberName: member.name, memberEmail: member.email }
      );
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
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
      {/* Header and Analytics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage and view all club members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          {user?.role !== "panel" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Member addition form will be implemented here.
                </p>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              All registered members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics.activeMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalMembers > 0 
                ? Math.round((analytics.activeMembers / analytics.totalMembers) * 100) 
                : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Members</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {analytics.inactiveMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Academic Batches</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analytics.totalBatches}
            </div>
            <p className="text-xs text-muted-foreground">
              Different batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Academic Streams</CardTitle>
            <Filter className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {analytics.totalStreams}
            </div>
            <p className="text-xs text-muted-foreground">
              Different streams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members by Batch Chart */}
      {analytics.batchData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Members by Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.batchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center flex-1 w-full">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <Input
                placeholder="Search members by name, email, ID, stream, or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={streamFilter} onValueChange={setStreamFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Streams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {[...new Set(members.map(member => member.stream))].sort().map(stream => (
                    <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {[...new Set(members.map(member => member.year || member.batch))].sort().map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} members
            </p>
            <Badge variant="outline" className="text-sm">
              {filteredMembers.length} Results
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.photoUrl} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-sm">
                      {member.phone || "N/A"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {member.rollNumber || "N/A"}
                    </TableCell>
                    <TableCell>{member.stream}</TableCell>
                    <TableCell className="text-sm">
                      {member.section || "N/A"}
                    </TableCell>
                    <TableCell>{member.year || member.batch}</TableCell>
                    <TableCell className="text-sm max-w-[150px]">
                      {member.techSkills && member.techSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {member.techSkills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.techSkills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.techSkills.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No skills listed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => viewMemberDetails(member)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => 
                              updateMemberStatus(
                                member.id,
                                member.status === "active" ? "inactive" : "active"
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user?.role !== "panel" && (
                            <DropdownMenuItem 
                              onClick={() => deleteMember(member.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Member Detail Modal */}
      <ErrorBoundary>
        <MemberDetailModal
          member={selectedMember}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={(member) => {
            updateMember(member);
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
