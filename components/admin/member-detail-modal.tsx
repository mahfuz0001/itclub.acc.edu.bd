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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  ExternalLink,
  Users,
  School,
  Trophy,
  Target,
  Lightbulb,
  Code,
  Briefcase,
  Heart,
  Github,
  Facebook
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMember, setEditedMember] = useState<Member | null>(null);
  
  if (!member) return null;

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset changes
      setEditedMember(null);
      setIsEditMode(false);
    } else {
      // Start edit - copy member data
      setEditedMember({ ...member });
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    if (editedMember && onEdit) {
      onEdit(editedMember);
      setIsEditMode(false);
      setEditedMember(null);
    }
  };

  const handleFieldChange = (field: keyof Member, value: string) => {
    if (editedMember) {
      setEditedMember({
        ...editedMember,
        [field]: value,
      });
    }
  };

  const currentMember = isEditMode ? editedMember : member;
  if (!currentMember) return null;

  const handleExportProfile = () => {
    const profileData = {
      name: currentMember.name,
      email: currentMember.email,
      stream: currentMember.stream,
      batch: currentMember.batch,
      year: currentMember.year,
      rollNumber: currentMember.rollNumber,
      status: currentMember.status,
      joinedDate: currentMember.createdAt,
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentMember.name.replace(/\s+/g, '_').toLowerCase()}_profile.json`;
    
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
                <AvatarImage src={currentMember.photoUrl} alt={currentMember.name} />
                <AvatarFallback className="text-lg">
                  {currentMember.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{currentMember.name}</DialogTitle>
                <DialogDescription className="text-lg">
                  {currentMember.stream} • Batch {currentMember.year || currentMember.batch}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(currentMember.status)}>
                {currentMember.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleExportProfile}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {isEditMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
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
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    {isEditMode ? (
                      <Input
                        value={currentMember.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        type="email"
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{currentMember.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Student ID</p>
                    {isEditMode ? (
                      <Input
                        value={currentMember.rollNumber || ''}
                        onChange={(e) => handleFieldChange('rollNumber', e.target.value)}
                        placeholder="Enter student ID"
                        className="text-sm font-mono"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground font-mono">
                        {currentMember.rollNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Academic Stream</p>
                    {isEditMode ? (
                      <Input
                        value={currentMember.stream}
                        onChange={(e) => handleFieldChange('stream', e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{currentMember.stream}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Batch/Year</p>
                    {isEditMode ? (
                      <Input
                        value={currentMember.year || currentMember.batch}
                        onChange={(e) => handleFieldChange('year', e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{currentMember.year || currentMember.batch}</p>
                    )}
                  </div>
                </div>

                {(currentMember.section || isEditMode) && (
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Section</p>
                      {isEditMode ? (
                        <Input
                          value={currentMember.section || ''}
                          onChange={(e) => handleFieldChange('section', e.target.value)}
                          placeholder="Enter section"
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{currentMember.section || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentMember.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Joined Date</p>
                      <p className="text-sm text-muted-foreground">
                        {safeFormatDate(currentMember.createdAt, 'PPP')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact & Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phone - required field */}
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  {isEditMode ? (
                    <Input
                      value={currentMember.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{currentMember.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              {/* Address - required field */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Address</p>
                  {isEditMode ? (
                    <Textarea
                      value={currentMember.address || ''}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="Enter address"
                      className="text-sm"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentMember.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              {/* Facebook - optional field */}
              {(currentMember.facebook || isEditMode) && (
                <div className="flex items-center gap-3">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Facebook Profile</p>
                    {isEditMode ? (
                      <Input
                        value={currentMember.facebook || ''}
                        onChange={(e) => handleFieldChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/your.profile"
                        className="text-sm"
                      />
                    ) : currentMember.facebook ? (
                      <a 
                        href={currentMember.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {currentMember.facebook}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Academic Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Previous School</p>
                  {isEditMode ? (
                    <Input
                      value={currentMember.previousSchool || ''}
                      onChange={(e) => handleFieldChange('previousSchool', e.target.value)}
                      placeholder="Enter previous school"
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{currentMember.previousSchool || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Experience */}
          {(((currentMember.techSkills?.length ?? 0) > 0) || ((currentMember.leadershipSkills?.length ?? 0) > 0) || ((currentMember.skills?.length ?? 0) > 0) || currentMember.techSkillsOther || currentMember.leadershipOther || ((currentMember.thingsToLearn?.length ?? 0) > 0) || isEditMode) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Technical Skills */}
                {((currentMember.techSkills?.length ?? 0) > 0 || currentMember.techSkillsOther || isEditMode) && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Technical Skills
                    </p>
                    {currentMember.techSkills && currentMember.techSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentMember.techSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(currentMember.techSkillsOther || isEditMode) && (
                      <div>
                        <p className="text-sm font-medium mb-1">Additional Technical Skills:</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.techSkillsOther || ''}
                            onChange={(e) => handleFieldChange('techSkillsOther', e.target.value)}
                            placeholder="Other technical skills"
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {currentMember.techSkillsOther || 'None specified'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Leadership Skills */}
                {((currentMember.leadershipSkills?.length ?? 0) > 0 || currentMember.leadershipOther || isEditMode) && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Leadership & Management Skills
                    </p>
                    {currentMember.leadershipSkills && currentMember.leadershipSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentMember.leadershipSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(currentMember.leadershipOther || isEditMode) && (
                      <div>
                        <p className="text-sm font-medium mb-1">Additional Leadership Skills:</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.leadershipOther || ''}
                            onChange={(e) => handleFieldChange('leadershipOther', e.target.value)}
                            placeholder="Other leadership skills"
                            className="text-sm"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {currentMember.leadershipOther || 'None specified'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* General Skills (for existing members) */}
                {currentMember.skills && Array.isArray(currentMember.skills) && currentMember.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">General Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {currentMember.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Things to Learn */}
                {((currentMember.thingsToLearn?.length ?? 0) > 0 || isEditMode) && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Learning Interests
                    </p>
                    {currentMember.thingsToLearn && currentMember.thingsToLearn.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentMember.thingsToLearn.map((item, index) => (
                          <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : isEditMode ? (
                      <p className="text-sm text-muted-foreground">No learning interests specified</p>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Achievements & Portfolio */}
          {(currentMember.achievements || currentMember.portfolio || currentMember.github || currentMember.freelancing || currentMember.website || isEditMode) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements & Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(currentMember.achievements || isEditMode) && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Achievements
                    </p>
                    {isEditMode ? (
                      <Textarea
                        value={currentMember.achievements || ''}
                        onChange={(e) => handleFieldChange('achievements', e.target.value)}
                        placeholder="List your past achievements in tech or competitions"
                        className="text-sm"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentMember.achievements}</p>
                    )}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {(currentMember.portfolio || isEditMode) && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Portfolio</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.portfolio || ''}
                            onChange={(e) => handleFieldChange('portfolio', e.target.value)}
                            placeholder="https://myportfolio.com"
                            className="text-sm"
                          />
                        ) : (
                          <a 
                            href={currentMember.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {currentMember.portfolio}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {(currentMember.github || isEditMode) && (
                    <div className="flex items-center gap-3">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">GitHub</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.github || ''}
                            onChange={(e) => handleFieldChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                            className="text-sm"
                          />
                        ) : (
                          <a 
                            href={currentMember.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {currentMember.github}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {(currentMember.website || isEditMode) && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Website</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.website || ''}
                            onChange={(e) => handleFieldChange('website', e.target.value)}
                            placeholder="https://mywebsite.com"
                            className="text-sm"
                          />
                        ) : (
                          <a 
                            href={currentMember.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {currentMember.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {(currentMember.freelancing || isEditMode) && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Freelancing</p>
                        {isEditMode ? (
                          <Input
                            value={currentMember.freelancing || ''}
                            onChange={(e) => handleFieldChange('freelancing', e.target.value)}
                            placeholder="https://fiverr.com/username"
                            className="text-sm"
                          />
                        ) : (
                          <a 
                            href={currentMember.freelancing} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {currentMember.freelancing}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Personal Statement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Reason - required field during signup */}
              <div>
                <p className="text-sm font-medium mb-2">Why they wanted to join</p>
                {isEditMode ? (
                  <Textarea
                    value={currentMember.reason || ''}
                    onChange={(e) => handleFieldChange('reason', e.target.value)}
                    placeholder="Tell us why you want to join our club and what you hope to achieve..."
                    className="text-sm"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentMember.reason || 'No reason provided'}</p>
                )}
              </div>

              {/* Terms Agreement Status */}
              {(typeof currentMember.agreeToTerms === 'boolean') && (
                <div>
                  <p className="text-sm font-medium mb-2">Agreed to Terms & Conditions</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${currentMember.agreeToTerms ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className={`text-sm ${currentMember.agreeToTerms ? 'text-green-700' : 'text-red-700'}`}>
                      {currentMember.agreeToTerms ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              )}

              {/* Bio - additional field for existing members */}
              {(currentMember.bio || isEditMode) && (
                <div>
                  <p className="text-sm font-medium mb-2">Bio</p>
                  {isEditMode ? (
                    <Textarea
                      value={currentMember.bio || ''}
                      onChange={(e) => handleFieldChange('bio', e.target.value)}
                      placeholder="Enter a short bio"
                      className="text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentMember.bio}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>


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
                      const days = safeDateDifference(currentMember.createdAt);
                      return days !== null ? days : 'N/A';
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Days as Member</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentMember.status === 'active' || currentMember.status === 'approved' ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Status</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentMember.position || 'Member'}
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