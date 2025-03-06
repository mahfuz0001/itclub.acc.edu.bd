"use client";

import type React from "react";

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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PlusCircle, Pencil, Trash2, Loader2, Upload } from "lucide-react";

// UI Components
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

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

const initialPanelistState = {
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
};

export default function PanelistsPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [formPanelist, setFormPanelist] = useState(initialPanelistState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    } catch (error) {
      console.error("Error fetching panelists:", error);
      toast({
        title: "Error",
        description: "Failed to load panelists data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormPanelist((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormPanelist(initialPanelistState);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleAddPanelist = async () => {
    try {
      setIsSubmitting(true);
      let imageUrl = formPanelist.image;

      if (imageFile) {
        const timestamp = new Date().getTime();
        const imagePath = `panelists/${timestamp}_${imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const panelistData = { ...formPanelist, image: imageUrl };
      const docRef = await addDoc(collection(db, "panelists"), panelistData);

      setPanelists([...panelists, { ...panelistData, id: docRef.id }]);
      toast({
        title: "Success",
        description: "Panelist added successfully",
      });

      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding panelist:", error);
      toast({
        title: "Error",
        description: "Failed to add panelist",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPanelist = (panelist: Panelist) => {
    setFormPanelist({ ...panelist, linkedin: panelist.linkedin || "" });
    setEditingId(panelist.id);
    setImagePreview(panelist.image);
    setOpenDialog(true);
  };

  const handleUpdatePanelist = async () => {
    if (!editingId) return;

    try {
      setIsSubmitting(true);
      let imageUrl = formPanelist.image;

      if (imageFile) {
        const timestamp = new Date().getTime();
        const imagePath = `panelists/${timestamp}_${imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const updatedData = { ...formPanelist, image: imageUrl };
      await updateDoc(doc(db, "panelists", editingId), updatedData);

      setPanelists(
        panelists.map((p) =>
          p.id === editingId ? { ...p, ...updatedData } : p
        )
      );

      toast({
        title: "Success",
        description: "Panelist updated successfully",
      });

      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating panelist:", error);
      toast({
        title: "Error",
        description: "Failed to update panelist",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePanelist = async (id: string) => {
    try {
      await deleteDoc(doc(db, "panelists", id));
      setPanelists(panelists.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Panelist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting panelist:", error);
      toast({
        title: "Error",
        description: "Failed to delete panelist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Panelists Management</CardTitle>
              <CardDescription>
                Add, edit, or remove panelists from the IT club
              </CardDescription>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Panelist
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Panelist" : "Add New Panelist"}
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="basic" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formPanelist.name}
                          onChange={handleInputChange}
                          placeholder="Full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formPanelist.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Profile Image</Label>
                        <div className="flex items-center gap-4">
                          {(imagePreview || formPanelist.image) && (
                            <Avatar className="h-16 w-16 border">
                              <AvatarImage
                                src={imagePreview || formPanelist.image}
                                alt="Preview"
                              />
                              <AvatarFallback>
                                {formPanelist.name
                                  ?.substring(0, 2)
                                  .toUpperCase() || "IMG"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-1">
                            <label
                              htmlFor="image-upload"
                              className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Upload image</span>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session">Session</Label>
                        <Input
                          id="session"
                          value={formPanelist.session}
                          onChange={handleInputChange}
                          placeholder="e.g. 2023-2024"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rank">Rank/Position</Label>
                        <Input
                          id="rank"
                          value={formPanelist.rank}
                          onChange={handleInputChange}
                          placeholder="e.g. President"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formPanelist.description}
                        onChange={handleInputChange}
                        placeholder="Brief description about the panelist"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input
                        id="contact"
                        value={formPanelist.contact}
                        onChange={handleInputChange}
                        placeholder="Phone number or alternative contact"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input
                        id="facebook"
                        value={formPanelist.facebook}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input
                        id="instagram"
                        value={formPanelist.instagram}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={formPanelist.linkedin || ""}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={
                      editingId ? handleUpdatePanelist : handleAddPanelist
                    }
                    disabled={isSubmitting || !formPanelist.name}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingId ? "Update Panelist" : "Add Panelist"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : panelists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No panelists found</p>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpenDialog(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add your first panelist
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Panelist</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panelists.map((panelist) => (
                    <TableRow key={panelist.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                panelist.image ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={panelist.name}
                            />
                            <AvatarFallback>
                              {panelist.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{panelist.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {panelist.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{panelist.rank}</Badge>
                      </TableCell>
                      <TableCell>{panelist.session}</TableCell>
                      <TableCell>{panelist.contact}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPanelist(panelist)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Panelist
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  {panelist.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeletePanelist(panelist.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
