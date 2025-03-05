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
import { db, storage } from "@/lib/firebase/config";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";

interface Panelist {
  id: string;
  name: string;
  email: string;
  image: string;
  session: string;
  rank: string;
  description: string;
  contact: string;
  facebook: string;
  instagram: string;
  linkedin?: string;
}

export default function PanelistsPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPanelist, setNewPanelist] = useState({
    name: "",
    email: "",
    image: "",
    session: "",
    rank: "",
    description: "",
    contact: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      let imageUrl = "";

      if (imageFile) {
        // const fileName = imageFile.name;
        // const imagePath = `panelists/${fileName}`;
        // const storageRef = ref(storage, imagePath);

        // await uploadBytes(storageRef, imageFile);
        // const imageUrl = await getDownloadURL(storageRef);

        const imagePath = `panelists/${imageFile.name}`;
        const imageRef = ref(storage, `${imagePath}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
      }

      const panelistData = { ...newPanelist, image: imageUrl };
      const docRef = await addDoc(collection(db, "panelists"), panelistData);

      setPanelists([...panelists, { ...newPanelist, id: docRef.id }]);
      setNewPanelist({
        name: "",
        email: "",
        image: "",
        session: "",
        rank: "",
        description: "",
        contact: "",
        facebook: "",
        instagram: "",
        linkedin: "",
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
              <Label htmlFor="image" className="text-right">
                Upload Image
              </Label>
              <Input
                type="file"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facebook" className="text-right">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={newPanelist.facebook}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, facebook: e.target.value })
                }
                className="col-span-3"
              />

              <Label htmlFor="instagram" className="text-right">
                Instagram
              </Label>
              <Input
                id="instagram"
                value={newPanelist.instagram}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, instagram: e.target.value })
                }
                className="col-span-3"
              />

              <Label htmlFor="linkedin" className="text-right">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={newPanelist.linkedin}
                onChange={(e) =>
                  setNewPanelist({ ...newPanelist, linkedin: e.target.value })
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
            <TableHead>Image</TableHead>
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
              <TableCell>
                <Image
                  src={panelist.image}
                  alt={panelist.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell>{panelist.session}</TableCell>
              <TableCell>{panelist.rank}</TableCell>
              <TableCell>{panelist.contact}</TableCell>
              <TableCell>{panelist.facebook}</TableCell>
              <TableCell>{panelist.instagram}</TableCell>
              <TableCell>{panelist.linkedin}</TableCell>
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
