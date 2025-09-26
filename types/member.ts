export interface Member {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  stream: string;
  batch: string;
  photoUrl?: string;
  role?: string;
  createdAt: string;
  year: string;
  status: "pending" | "approved" | "rejected";
  rollNumber?: string;
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
