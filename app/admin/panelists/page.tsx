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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Panelist {
  id: string;
  name: string;
  email: string;
  position: string;
  image: string;
  session: string;
  rank: string;
  description: string;
  contact: string;
}

export default function PanelistsPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPanelist, setNewPanelist] = useState({
    name: "",
    email: "",
    position: "",
    image: "",
    session: "",
    rank: "",
    description: "",
    contact: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPanelists();
  }, []);

  const fetchPanelists = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "panelists"));
      const fetchedPanelists = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Panelist)
      );
      setPanelists(fetchedPanelists);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching panelists:", error);
      setLoading(false);
    }
  };

  const handleAddPanelist = async () => {
    try {
      const docRef = await addDoc(collection(db, "panelists"), newPanelist);
      setPanelists([...panelists, { ...newPanelist, id: docRef.id }]);
      setNewPanelist({
        name: "",
        email: "",
        position: "",
        image: "",
        session: "",
        rank: "",
        description: "",
        contact: "",
      });
    } catch (error) {
      console.error("Error adding panelist:", error);
    }
  };

  const handleUpdatePanelist = async (
    id: string,
    updatedData: Partial<Panelist>
  ) => {
    try {
      await updateDoc(doc(db, "panelists", id), updatedData);
      setPanelists(
        panelists.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
    } catch (error) {
      console.error("Error updating panelist:", error);
    }
  };

  const handleDeletePanelist = async (id: string) => {
    try {
      await deleteDoc(doc(db, "panelists", id));
      setPanelists(panelists.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting panelist:", error);
    }
  };

  if (loading) {
    return <div>Loading panelists...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panelists</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Panelist</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Panelist</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPanelist.name}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newPanelist.email}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={newPanelist.position}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, position: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={newPanelist.image}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, image: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session" className="text-right">
                Session
              </Label>
              <Input
                id="session"
                value={newPanelist.session}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, session: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rank" className="text-right">
                Rank
              </Label>
              <Input
                id="rank"
                value={newPanelist.rank}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, rank: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newPanelist.description}
                onChange={(e) =>
                  setNewPanelist({
                    ...newPanelist,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact Info
              </Label>
              <Input
                id="contact"
                value={newPanelist.contact}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, contact: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddPanelist}>Add Panelist</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {panelists.map((panelist) => (
            <TableRow key={panelist.id}>
              <TableCell>{panelist.name}</TableCell>
              <TableCell>{panelist.email}</TableCell>
              <TableCell>{panelist.position}</TableCell>
              <TableCell>{panelist.session}</TableCell>
              <TableCell>{panelist.rank}</TableCell>
              <TableCell>{panelist.contact}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() =>
                    handleUpdatePanelist(panelist.id, { name: "Updated Name" })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePanelist(panelist.id)}
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
