"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Hash,
  MapPin,
  Phone,
  Globe,
  Edit,
  Download,
  ExternalLink
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

// Safe date parsing utility functions
const safeParseDateString = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null;
  
  try {
    // Try parsing as ISO string first
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) return isoDate;
    
    // Try parsing as regular Date
    const date = new Date(dateString);
    if (isValid(date)) return date;
    
    return null;
  } catch {
    return null;
  }
};

const safeFormatDate = (dateString: string | undefined | null, formatStr: string): string => {
  const date = safeParseDateString(dateString);
  if (!date) return 'N/A';
  
  try {
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

const safeDateDifference = (dateString: string | undefined | null): number | null => {
  const date = safeParseDateString(dateString);
  if (!date) return null;
  
  try {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
};

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
  phone?: string;
  address?: string;
  website?: string;
  bio?: string;
  skills?: string[];
  position?: string;
  joinedDate?: string;
}

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (member: Member) => void;
}

export default function MemberDetailModal({
  member,
  isOpen,
  onClose,
  onEdit,
}: MemberDetailModalProps) {
  if (!member) return null;

  const handleExportProfile = () => {
    const profileData = {
      name: member.name,
      email: member.email,
      stream: member.stream,
      batch: member.batch,
      year: member.year,
      rollNumber: member.rollNumber,
      status: member.status,
      joinedDate: member.createdAt,
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${member.name.replace(/\s+/g, '_').toLowerCase()}_profile.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.photoUrl} alt={member.name} />
                <AvatarFallback className="text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                <DialogDescription className="text-lg">
                  {member.stream} • Batch {member.year || member.batch}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleExportProfile}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Student ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {member.rollNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Academic Stream</p>
                    <p className="text-sm text-muted-foreground">{member.stream}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Batch/Year</p>
                    <p className="text-sm text-muted-foreground">{member.year || member.batch}</p>
                  </div>
                </div>

                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                )}

                {member.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Joined Date</p>
                      <p className="text-sm text-muted-foreground">
                        {safeFormatDate(member.createdAt, 'PPP')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(member.bio || member.address || member.website || (member.skills && member.skills.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.bio && (
                  <div>
                    <p className="text-sm font-medium mb-2">Bio</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                )}

                {member.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{member.address}</p>
                    </div>
                  </div>
                )}

                {member.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a 
                        href={member.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {member.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {member.skills && member.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Member Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Member Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(() => {
                      const days = safeDateDifference(member.createdAt);
                      return days !== null ? days : 'N/A';
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Days as Member</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {member.status === 'active' || member.status === 'approved' ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Status</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {member.position || 'Member'}
                  </div>
                  <div className="text-sm text-muted-foreground">Position</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}