"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "panel" | "root";
  assignedYear?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<{
    email: string;
    role: "admin" | "panel" | "root";
    assignedYear: string;
  }>({ email: "", role: "admin", assignedYear: "" });
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "adminUsers"));
      const fetchedUsers = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AdminUser)
      );
      setUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const docRef = await addDoc(collection(db, "adminUsers"), newUser);
      setUsers([...users, { ...newUser, id: docRef.id }]);
      setNewUser({ email: "", role: "admin", assignedYear: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async (
    id: string,
    updatedData: Partial<AdminUser>
  ) => {
    try {
      await updateDoc(doc(db, "adminUsers", id), updatedData);
      setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "adminUsers", id));
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (user?.role !== "root") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "admin" | "panel" | "root") =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="root">Root</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUser.role === "panel" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedYear" className="text-right">
                  Assigned Year
                </Label>
                <Input
                  id="assignedYear"
                  value={newUser.assignedYear}
                  onChange={(e) =>
                    setNewUser({ ...newUser, assignedYear: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Assigned Year</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.assignedYear || "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() =>
                    handleUpdateUser(user.id, {
                      role: user.role === "admin" ? "panel" : "admin",
                    })
                  }
                >
                  Toggle Role
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
