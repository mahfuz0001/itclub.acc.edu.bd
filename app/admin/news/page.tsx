"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
});

interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishedAt: Timestamp;
  imageUrl?: string;
  category: string;
  tags: string[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    summary: "",
    author: "",
    category: "",
    tags: [],
    published: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === "admin") {
      fetchNewsItems();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchNewsItems();
    }
  }, [currentPage, user]);

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, "news"),
        orderBy("publishedAt", "desc"),
        limit(itemsPerPage)
      );

      if (lastVisible && currentPage > 1) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const fetchedNews = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as NewsItem)
      );
      setNewsItems(fetchedNews);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setError(null);
    } catch (error) {
      console.error("Error fetching news items:", error);
      setError("Failed to load news items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewsItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "news"), {
        ...newItem,
        publishedAt: Timestamp.now(),
      });
      setNewsItems([
        { ...newItem, id: docRef.id, publishedAt: Timestamp.now() } as NewsItem,
        ...newsItems,
      ]);
      setNewItem({
        title: "",
        content: "",
        summary: "",
        author: "",
        category: "",
        tags: [],
        published: false,
        metaTitle: "",
        metaDescription: "",
      });
      toast({
        title: "News item added successfully",
        description: "The new news item has been added to the database.",
      });
    } catch (error) {
      console.error("Error adding news item:", error);
      toast({
        title: "Error adding news item",
        description:
          "There was an error adding the news item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNewsItem = async (
    id: string,
    updatedData: Partial<NewsItem>
  ) => {
    try {
      await updateDoc(doc(db, "news", id), updatedData);
      setNewsItems(
        newsItems.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
      setIsEditing(false);
      setEditingId(null);
      toast({
        title: "News item updated successfully",
        description: "The news item has been updated in the database.",
      });
    } catch (error) {
      console.error("Error updating news item:", error);
      toast({
        title: "Error updating news item",
        description:
          "There was an error updating the news item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNewsItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "news", id));
      setNewsItems(newsItems.filter((item) => item.id !== id));
      toast({
        title: "News item deleted successfully",
        description: "The news item has been removed from the database.",
      });
    } catch (error) {
      console.error("Error deleting news item:", error);
      toast({
        title: "Error deleting news item",
        description:
          "There was an error deleting the news item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `news-images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">News Management</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New News Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Add New News Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="summary" className="text-right">
                  Summary
                </Label>
                <Textarea
                  id="summary"
                  value={newItem.summary}
                  onChange={(e) =>
                    setNewItem({ ...newItem, summary: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <div className="col-span-3">
                  <RichTextEditor
                    content={newItem.content || ""}
                    onChange={(content) => setNewItem({ ...newItem, content })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Author
                </Label>
                <Input
                  id="author"
                  value={newItem.author}
                  onChange={(e) =>
                    setNewItem({ ...newItem, author: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={newItem.tags?.join(", ")}
                  onChange={(e) =>
                    setNewItem({ ...newItem, tags: e.target.value.split(", ") })
                  }
                  className="col-span-3"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="published" className="text-right">
                  Published
                </Label>
                <Switch
                  id="published"
                  checked={newItem.published}
                  onCheckedChange={(checked) =>
                    setNewItem({ ...newItem, published: checked })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="metaTitle" className="text-right">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  value={newItem.metaTitle}
                  onChange={(e) =>
                    setNewItem({ ...newItem, metaTitle: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="metaDescription" className="text-right">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  value={newItem.metaDescription}
                  onChange={(e) =>
                    setNewItem({ ...newItem, metaDescription: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddNewsItem}>Add News Item</Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-[250px]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {item.publishedAt instanceof Timestamp
                      ? item.publishedAt.toDate().toLocaleString()
                      : "Unknown date"}{" "}
                    | {item.author} | {item.category}
                  </p>
                  <p className="mt-2">{item.summary}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(true);
                        setEditingId(item.id);
                        setNewItem(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteNewsItem(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={newsItems.length < itemsPerPage}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Edit News Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-summary" className="text-right">
                  Summary
                </Label>
                <Textarea
                  id="edit-summary"
                  value={newItem.summary}
                  onChange={(e) =>
                    setNewItem({ ...newItem, summary: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">
                  Content
                </Label>
                <div className="col-span-3">
                  <RichTextEditor
                    content={newItem.content || ""}
                    onChange={(content) => setNewItem({ ...newItem, content })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-author" className="text-right">
                  Author
                </Label>
                <Input
                  id="edit-author"
                  value={newItem.author}
                  onChange={(e) =>
                    setNewItem({ ...newItem, author: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={newItem.tags?.join(", ")}
                  onChange={(e) =>
                    setNewItem({ ...newItem, tags: e.target.value.split(", ") })
                  }
                  className="col-span-3"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-published" className="text-right">
                  Published
                </Label>
                <Switch
                  id="edit-published"
                  checked={newItem.published}
                  onCheckedChange={(checked) =>
                    setNewItem({ ...newItem, published: checked })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-metaTitle" className="text-right">
                  Meta Title
                </Label>
                <Input
                  id="edit-metaTitle"
                  value={newItem.metaTitle}
                  onChange={(e) =>
                    setNewItem({ ...newItem, metaTitle: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-metaDescription" className="text-right">
                  Meta Description
                </Label>
                <Textarea
                  id="edit-metaDescription"
                  value={newItem.metaDescription}
                  onChange={(e) =>
                    setNewItem({ ...newItem, metaDescription: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={() => handleUpdateNewsItem(editingId!, newItem)}>
              Update News Item
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
