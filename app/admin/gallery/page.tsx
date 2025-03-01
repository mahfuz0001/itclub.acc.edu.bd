"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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
} from "@/components/ui/dialog";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  imagePath: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    file: null as File | null,
    caption: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));

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
            return { id: doc.id, imageUrl, caption: data.caption, imagePath };
          } catch (err) {
            console.error(`Error fetching image URL for ${doc.id}:`, err);
            return null;
          }
        })
      );

      setGalleryItems(
        fetchedItems.filter((item) => item !== null) as GalleryItem[]
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setLoading(false);
    }
  };

  const handleAddGalleryItem = async () => {
    if (!newItem.file) return;

    try {
      const fileName = `${Date.now()}-${newItem.file.name}`;
      const imagePath = `gallery/${fileName}`;
      const storageRef = ref(storage, imagePath);

      await uploadBytes(storageRef, newItem.file);
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, "gallery"), {
        imagePath,
        caption: newItem.caption,
      });

      setGalleryItems([
        ...galleryItems,
        {
          id: docRef.id,
          imageUrl: downloadURL,
          caption: newItem.caption,
          imagePath,
        },
      ]);
      setNewItem({ file: null, caption: "" });
    } catch (error) {
      console.error("Error adding gallery item:", error);
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
    } catch (error) {
      console.error("Error deleting gallery item:", error);
    }
  };

  if (loading) {
    return <div>Loading gallery items...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gallery Management</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Gallery Item</Button>
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
                  setNewItem({ ...newItem, file: e.target.files?.[0] || null })
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
          <Button onClick={handleAddGalleryItem}>Add Gallery Item</Button>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <div key={item.id} className="relative">
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.caption}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
              <p>{item.caption}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteGalleryItem(item.id, item.imagePath)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
