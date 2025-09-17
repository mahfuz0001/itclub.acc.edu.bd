"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { LoadingPage, LoadingOverlay } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { 
  getSafeErrorMessage, 
  logError, 
  withErrorHandling, 
  retryOperation 
} from "@/lib/utils/error-handler";
import { 
  validateEmail, 
  validatePhone, 
  validateText, 
  sanitizeObject 
} from "@/lib/utils/validation";

interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
}

function WebsitePageContent() {
  const [content, setContent] = useState<WebsiteContent>({
    heroTitle: "",
    heroSubtitle: "",
    aboutText: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      fetchWebsiteContent();
    } else if (!authLoading && !user) {
      setError("You must be logged in to access this page.");
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchWebsiteContent = async () => {
    const result = await withErrorHandling(
      async () => {
        if (!db) {
          throw new Error("Database not initialized");
        }

        const docRef = doc(db, "websiteContent", "main");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as WebsiteContent;
          const sanitizedData = sanitizeObject(data) as WebsiteContent;
          return sanitizedData;
        }
        
        return null;
      },
      "Fetching website content"
    );

    if (result !== null) {
      setContent(result);
      setError(null);
    } else {
      setError("Failed to load website content. Please try again.");
    }
    
    setLoading(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate hero title
    const titleValidation = validateText(content.heroTitle, {
      minLength: 1,
      maxLength: 100,
      required: true,
    });
    if (!titleValidation.isValid) {
      errors.heroTitle = titleValidation.errors[0];
    }

    // Validate hero subtitle
    const subtitleValidation = validateText(content.heroSubtitle, {
      minLength: 1,
      maxLength: 200,
      required: true,
    });
    if (!subtitleValidation.isValid) {
      errors.heroSubtitle = subtitleValidation.errors[0];
    }

    // Validate about text
    const aboutValidation = validateText(content.aboutText, {
      minLength: 10,
      maxLength: 2000,
      required: true,
    });
    if (!aboutValidation.isValid) {
      errors.aboutText = aboutValidation.errors[0];
    }

    // Validate email
    const emailValidation = validateEmail(content.contactEmail);
    if (!emailValidation.isValid) {
      errors.contactEmail = "Please enter a valid email address";
    }

    // Validate phone
    const phoneValidation = validatePhone(content.contactPhone);
    if (!phoneValidation.isValid) {
      errors.contactPhone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateContent = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await retryOperation(
        async () => {
          if (!db) {
            throw new Error("Database not initialized");
          }

          const docRef = doc(db, "websiteContent", "main");
          const sanitizedContent = sanitizeObject(content) as WebsiteContent;
          await updateDoc(docRef, { ...sanitizedContent });
        },
        3,
        1000,
        "Updating website content"
      );

      toast({
        title: "Success",
        description: "Website content updated successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = getSafeErrorMessage(error);
      setError(errorMessage);
      logError(error, "Updating website content");
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof WebsiteContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (authLoading || loading) {
    return <LoadingPage message="Loading website content..." />;
  }

  if (error && !content.heroTitle) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchWebsiteContent} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <LoadingOverlay isLoading={saving} message="Saving website content...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Website Content Management</h1>
          {user && (
            <div className="text-sm text-muted-foreground">
              Logged in as: {user.email}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title *</Label>
            <Input
              id="heroTitle"
              value={content.heroTitle}
              onChange={(e) => handleInputChange('heroTitle', e.target.value)}
              className={validationErrors.heroTitle ? "border-red-500" : ""}
              placeholder="Enter hero title..."
              maxLength={100}
            />
            {validationErrors.heroTitle && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.heroTitle}</p>
            )}
          </div>

          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle *</Label>
            <Input
              id="heroSubtitle"
              value={content.heroSubtitle}
              onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
              className={validationErrors.heroSubtitle ? "border-red-500" : ""}
              placeholder="Enter hero subtitle..."
              maxLength={200}
            />
            {validationErrors.heroSubtitle && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.heroSubtitle}</p>
            )}
          </div>

          <div>
            <Label htmlFor="aboutText">About Text *</Label>
            <Textarea
              id="aboutText"
              value={content.aboutText}
              onChange={(e) => handleInputChange('aboutText', e.target.value)}
              className={validationErrors.aboutText ? "border-red-500" : ""}
              placeholder="Enter about text..."
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              {validationErrors.aboutText && (
                <p className="text-sm text-red-500">{validationErrors.aboutText}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {content.aboutText.length}/2000
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={content.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className={validationErrors.contactEmail ? "border-red-500" : ""}
              placeholder="Enter contact email..."
            />
            {validationErrors.contactEmail && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.contactEmail}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contactPhone">Contact Phone *</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={content.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className={validationErrors.contactPhone ? "border-red-500" : ""}
              placeholder="Enter contact phone..."
            />
            {validationErrors.contactPhone && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.contactPhone}</p>
            )}
          </div>
        </div>

        <Button 
          onClick={handleUpdateContent} 
          disabled={saving || Object.keys(validationErrors).length > 0}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Website Content
            </>
          )}
        </Button>
      </div>
    </LoadingOverlay>
  );
}

export default function WebsitePage() {
  return (
    <ErrorBoundary>
      <WebsitePageContent />
    </ErrorBoundary>
  );
}
