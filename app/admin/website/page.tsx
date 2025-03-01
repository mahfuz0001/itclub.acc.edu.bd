"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
}

export default function WebsitePage() {
  const [content, setContent] = useState<WebsiteContent>({
    heroTitle: "",
    heroSubtitle: "",
    aboutText: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      const docRef = doc(db, "websiteContent", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data() as WebsiteContent);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching website content:", error);
      setLoading(false);
    }
  };

  const handleUpdateContent = async () => {
    try {
      const docRef = doc(db, "websiteContent", "main");
      await updateDoc(docRef, { ...content });
      alert("Website content updated successfully!");
    } catch (error) {
      console.error("Error updating website content:", error);
      alert("Failed to update website content. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading website content...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Website Content Management</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="heroTitle">Hero Title</Label>
          <Input
            id="heroTitle"
            value={content.heroTitle}
            onChange={(e) =>
              setContent({ ...content, heroTitle: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
          <Input
            id="heroSubtitle"
            value={content.heroSubtitle}
            onChange={(e) =>
              setContent({ ...content, heroSubtitle: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="aboutText">About Text</Label>
          <Textarea
            id="aboutText"
            value={content.aboutText}
            onChange={(e) =>
              setContent({ ...content, aboutText: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            value={content.contactEmail}
            onChange={(e) =>
              setContent({ ...content, contactEmail: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={content.contactPhone}
            onChange={(e) =>
              setContent({ ...content, contactPhone: e.target.value })
            }
          />
        </div>
      </div>

      <Button onClick={handleUpdateContent}>Update Website Content</Button>
    </div>
  );
}
