export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  stream: string;
  batch: string;
  photoUrl?: string;
  role?: string;
  createdAt: string;
  year: string;
  status: "pending" | "approved" | "rejected";
}
