"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth-provider";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "panel" | "root";
  assignedYear?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState({
    email: "",
    role: "admin",
    assignedYear: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const q = query(collection(db, "adminUsers"));
    const querySnapshot = await getDocs(q);
    const fetchedUsers = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as AdminUser)
    );
    setUsers(fetchedUsers);
  };

  const addUser = async () => {
    try {
      await addDoc(collection(db, "adminUsers"), newUser);
      toast({ title: "User added successfully" });
      fetchUsers();
      setNewUser({ email: "", role: "admin", assignedYear: "" });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({ title: "Error adding user", variant: "destructive" });
    }
  };

  const updateUser = async (id: string, data: Partial<AdminUser>) => {
    try {
      await updateDoc(doc(db, "adminUsers", id), data);
      toast({ title: "User updated successfully" });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: "Error updating user", variant: "destructive" });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "adminUsers", id));
      toast({ title: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({ title: "Error deleting user", variant: "destructive" });
    }
  };

  if (user?.role !== "root") {
    return <div>You do not have permission to manage users.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="flex gap-4">
        <Input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Select
          value={newUser.role}
          onValueChange={(value) =>
            setNewUser({
              ...newUser,
              role: value as "admin" | "panel" | "root",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="panel">Panel</SelectItem>
            <SelectItem value="root">Root</SelectItem>
          </SelectContent>
        </Select>
        {newUser.role === "panel" && (
          <Input
            placeholder="Assigned Year"
            value={newUser.assignedYear}
            onChange={(e) =>
              setNewUser({ ...newUser, assignedYear: e.target.value })
            }
          />
        )}
        <Button onClick={addUser}>Add User</Button>
      </div>

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
                  onClick={() =>
                    updateUser(user.id, {
                      role: user.role === "admin" ? "panel" : "admin",
                    })
                  }
                >
                  Toggle Role
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteUser(user.id)}
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
