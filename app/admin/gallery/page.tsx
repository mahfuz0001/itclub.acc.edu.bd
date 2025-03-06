"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  imagePath: string;
  createdAt: Date;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    file: null as File | null,
    caption: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const itemsPerPage = 9;

  useEffect(() => {
    fetchGalleryItems();
  }, [currentPage]);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, "gallery"),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
      );

      if (lastVisible && currentPage > 1) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);

      const fetchedItems = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imagePath = data.imagePath;

          if (!imagePath) {
            console.warn(
              `Skipping document ${doc.id} due to missing imagePath`
            );
            return null;
          }

          try {
            const imageUrl = await getDownloadURL(ref(storage, imagePath));
            return {
              id: doc.id,
              imageUrl,
              caption: data.caption,
              imagePath,
              createdAt: data.createdAt.toDate(),
            };
          } catch (err) {
            console.error(`Error fetching image URL for ${doc.id}:`, err);
            return null;
          }
        })
      );

      setGalleryItems(
        fetchedItems.filter((item) => item !== null) as GalleryItem[]
      );
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGalleryItem = async () => {
    if (!newItem.file) return;

    try {
      setIsUploading(true);
      const fileName = `${Date.now()}-${newItem.file.name}`;
      const imagePath = `gallery/${fileName}`;
      const storageRef = ref(storage, imagePath);

      await uploadBytes(storageRef, newItem.file);
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, "gallery"), {
        imagePath,
        caption: newItem.caption,
        createdAt: new Date(),
      });

      setGalleryItems([
        {
          id: docRef.id,
          imageUrl: downloadURL,
          caption: newItem.caption,
          imagePath,
          createdAt: new Date(),
        },
        ...galleryItems,
      ]);
      setNewItem({ file: null, caption: "" });
      toast({
        title: "Success",
        description: "Gallery item added successfully.",
      });
    } catch (error) {
      console.error("Error adding gallery item:", error);
      toast({
        title: "Error",
        description: "Failed to add gallery item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, imagePath: string) => {
    try {
      await deleteDoc(doc(db, "gallery", id));

      if (imagePath) {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }

      setGalleryItems(galleryItems.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Gallery item deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (user?.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        file: e.target.files?.[0] || null,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="caption" className="text-right">
                    Caption
                  </Label>
                  <Input
                    id="caption"
                    value={newItem.caption}
                    onChange={(e) =>
                      setNewItem({ ...newItem, caption: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddGalleryItem} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Add Gallery Item"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 rounded-md" />
                  <Skeleton className="w-3/4 h-4 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery items found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0 relative group">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.caption}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end justify-between p-4">
                      <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.caption}
                      </p>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          handleDeleteGalleryItem(item.id, item.imagePath)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <span>Page {currentPage}</span>
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={galleryItems.length < itemsPerPage}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
