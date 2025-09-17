"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { LoadingPage, LoadingOverlay } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { AlertCircle, Save, Settings as SettingsIcon } from "lucide-react";
import { 
  getSafeErrorMessage, 
  logError, 
  withErrorHandling, 
  retryOperation 
} from "@/lib/utils/error-handler";
import { 
  validateText, 
  sanitizeObject 
} from "@/lib/utils/validation";

interface Settings {
  siteName: string;
  maintenanceMode: boolean;
  maxApplicationsPerDay: number;
}

function SettingsPageContent() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    maintenanceMode: false,
    maxApplicationsPerDay: 50,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      // Check if user has admin privileges
      if (user.role !== 'admin' && user.role !== 'root') {
        setError("You do not have permission to access settings.");
        setLoading(false);
        return;
      }
      fetchSettings();
    } else if (!authLoading && !user) {
      setError("You must be logged in to access this page.");
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchSettings = async () => {
    const result = await withErrorHandling(
      async () => {
        if (!db) {
          throw new Error("Database not initialized");
        }

        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Settings;
          const sanitizedData = sanitizeObject(data) as Settings;
          return sanitizedData;
        }
        
        return null;
      },
      "Fetching settings"
    );

    if (result !== null) {
      setSettings(result);
      setError(null);
    } else {
      setError("Failed to load settings. Please try again.");
    }
    
    setLoading(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate site name
    const siteNameValidation = validateText(settings.siteName, {
      minLength: 1,
      maxLength: 100,
      required: true,
    });
    if (!siteNameValidation.isValid) {
      errors.siteName = siteNameValidation.errors[0];
    }

    // Validate max applications per day
    if (settings.maxApplicationsPerDay < 1 || settings.maxApplicationsPerDay > 1000) {
      errors.maxApplicationsPerDay = "Must be between 1 and 1000";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSettings = async () => {
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

          const docRef = doc(db, "settings", "main");
          const sanitizedSettings = sanitizeObject(settings) as Settings;
          await updateDoc(docRef, { ...sanitizedSettings });
        },
        3,
        1000,
        "Updating settings"
      );

      toast({
        title: "Success",
        description: "Settings updated successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = getSafeErrorMessage(error);
      setError(errorMessage);
      logError(error, "Updating settings");
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNumberInputChange = (field: keyof Settings, value: string) => {
    const numValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numValue)) {
      handleInputChange(field, numValue);
    }
  };

  if (authLoading || loading) {
    return <LoadingPage message="Loading settings..." />;
  }

  if (error && !settings.siteName) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {user && (user.role === 'admin' || user.role === 'root') && (
          <Button onClick={fetchSettings} variant="outline">
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <LoadingOverlay isLoading={saving} message="Saving settings...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          {user && (
            <div className="text-sm text-muted-foreground">
              Role: {user.role} | {user.email}
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
            <Label htmlFor="siteName">Site Name *</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className={validationErrors.siteName ? "border-red-500" : ""}
              placeholder="Enter site name..."
              maxLength={100}
            />
            {validationErrors.siteName && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.siteName}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                handleInputChange('maintenanceMode', checked)
              }
            />
            <Label htmlFor="maintenanceMode" className="cursor-pointer">
              Maintenance Mode
            </Label>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            When enabled, the website will show a maintenance message to users.
          </p>

          <div>
            <Label htmlFor="maxApplicationsPerDay">
              Max Applications Per Day *
            </Label>
            <Input
              id="maxApplicationsPerDay"
              type="number"
              min="1"
              max="1000"
              value={settings.maxApplicationsPerDay}
              onChange={(e) => handleNumberInputChange('maxApplicationsPerDay', e.target.value)}
              className={validationErrors.maxApplicationsPerDay ? "border-red-500" : ""}
              placeholder="Enter maximum applications per day..."
            />
            {validationErrors.maxApplicationsPerDay && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.maxApplicationsPerDay}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Limits the number of membership applications that can be submitted per day.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleUpdateSettings} 
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
              Update Settings
            </>
          )}
        </Button>
      </div>
    </LoadingOverlay>
  );
}

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <SettingsPageContent />
    </ErrorBoundary>
  );
}
