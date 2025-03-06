"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";
import Image from "next/image";

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
  slug: string;
  canonicalUrl?: string;
  structuredData?: string;
  scheduledPublishDate?: Timestamp;
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
    slug: "",
    canonicalUrl: "",
    structuredData: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === "admin") {
      fetchNewsItems();
    }
  }, [user]);

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

  const filteredNews = useMemo(() => {
    return newsItems.filter(
      (item) =>
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === "all" || item.category === categoryFilter)
    );
  }, [newsItems, searchTerm, categoryFilter]);

  const handleAddNewsItem = async () => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const docRef = await addDoc(collection(db, "news"), {
        ...newItem,
        imageUrl,
        publishedAt: Timestamp.now(),
        scheduledPublishDate: date ? Timestamp.fromDate(date) : null,
      });

      setNewsItems([
        {
          ...newItem,
          id: docRef.id,
          publishedAt: Timestamp.now(),
          imageUrl,
        } as NewsItem,
        ...newsItems,
      ]);

      resetForm();
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
      let imageUrl = updatedData.imageUrl;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (updatedData.imageUrl) {
          await deleteImage(updatedData.imageUrl);
        }
      }

      await updateDoc(doc(db, "news", id), { ...updatedData, imageUrl });
      setNewsItems(
        newsItems.map((item) =>
          item.id === id ? { ...item, ...updatedData, imageUrl } : item
        )
      );
      setIsEditing(false);
      setEditingId(null);
      resetForm();
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
      const newsItem = newsItems.find((item) => item.id === id);
      if (newsItem?.imageUrl) {
        await deleteImage(newsItem.imageUrl);
      }
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

  const deleteImage = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
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
      slug: "",
      canonicalUrl: "",
      structuredData: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setDate(undefined);
  };

  if (user?.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>News Management</CardTitle>
        <CardDescription>Add, edit, or remove news items</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center w-full md:w-auto">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="Class">Class</SelectItem>
              <SelectItem value="Exam">Exam</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New News Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Add New News Item</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
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
                          <SelectItem value="announcement">
                            Announcement
                          </SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="Class">Class</SelectItem>
                          <SelectItem value="Exam">Exam</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                          setNewItem({
                            ...newItem,
                            tags: e.target.value.split(", "),
                          })
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
                      <Label
                        htmlFor="scheduledPublishDate"
                        className="text-right"
                      >
                        Scheduled Publish Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`col-span-3 justify-start text-left font-normal ${
                              !date && "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="image"
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                        {imagePreview && (
                          <div className="mt-2">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="content">
                  <div className="grid gap-4 py-4">
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
                          onChange={(content) =>
                            setNewItem({ ...newItem, content })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="seo">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug" className="text-right">
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        value={newItem.slug}
                        onChange={(e) =>
                          setNewItem({ ...newItem, slug: e.target.value })
                        }
                        className="col-span-3"
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
                          setNewItem({
                            ...newItem,
                            metaDescription: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="canonicalUrl" className="text-right">
                        Canonical URL
                      </Label>
                      <Input
                        id="canonicalUrl"
                        value={newItem.canonicalUrl}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            canonicalUrl: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="structuredData" className="text-right">
                        Structured Data
                      </Label>
                      <Textarea
                        id="structuredData"
                        value={newItem.structuredData}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            structuredData: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Enter JSON-LD structured data"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button onClick={handleAddNewsItem}>Add News Item</Button>
              </DialogFooter>
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
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.title}</span>
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <span>
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        {item.publishedAt instanceof Timestamp
                          ? format(item.publishedAt.toDate(), "PPP")
                          : "Unknown date"}
                      </span>
                      <span>{item.author}</span>
                      <span>{item.category}</span>
                    </div>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        width={200}
                        height={150}
                        className="rounded-md mb-2"
                      />
                    )}
                    <p className="mb-2">{item.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true);
                          setEditingId(item.id);
                          setNewItem(item);
                          setImagePreview(item.imageUrl || null);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteNewsItem(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                disabled={newsItems.length < itemsPerPage}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Edit News Item</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
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
                        <SelectItem value="announcement">
                          Announcement
                        </SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="Class">Class</SelectItem>
                        <SelectItem value="Exam">Exam</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                        setNewItem({
                          ...newItem,
                          tags: e.target.value.split(", "),
                        })
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
                    <Label htmlFor="edit-image" className="text-right">
                      Image
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="edit-image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="content">
                <div className="grid gap-4 py-4">
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
                        onChange={(content) =>
                          setNewItem({ ...newItem, content })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="seo">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-slug" className="text-right">
                      Slug
                    </Label>
                    <Input
                      id="edit-slug"
                      value={newItem.slug}
                      onChange={(e) =>
                        setNewItem({ ...newItem, slug: e.target.value })
                      }
                      className="col-span-3"
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
                    <Label
                      htmlFor="edit-metaDescription"
                      className="text-right"
                    >
                      Meta Description
                    </Label>
                    <Textarea
                      id="edit-metaDescription"
                      value={newItem.metaDescription}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          metaDescription: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-canonicalUrl" className="text-right">
                      Canonical URL
                    </Label>
                    <Input
                      id="edit-canonicalUrl"
                      value={newItem.canonicalUrl}
                      onChange={(e) =>
                        setNewItem({ ...newItem, canonicalUrl: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-structuredData" className="text-right">
                      Structured Data
                    </Label>
                    <Textarea
                      id="edit-structuredData"
                      value={newItem.structuredData}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          structuredData: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="Enter JSON-LD structured data"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button onClick={() => handleUpdateNewsItem(editingId!, newItem)}>
                Update News Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
