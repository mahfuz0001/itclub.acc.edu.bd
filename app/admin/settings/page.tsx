"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-provider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Settings {
  siteName: string;
  maintenanceMode: boolean;
  maxApplicationsPerDay: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    maintenanceMode: false,
    maxApplicationsPerDay: 50,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const docRef = doc(db, "settings", "main");
      await updateDoc(docRef, { ...settings });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, maintenanceMode: checked })
            }
          />
          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
        </div>
        <div>
          <Label htmlFor="maxApplicationsPerDay">
            Max Applications Per Day
          </Label>
          <Input
            id="maxApplicationsPerDay"
            type="number"
            value={settings.maxApplicationsPerDay}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxApplicationsPerDay: Number.parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>

      <Button onClick={handleUpdateSettings}>Update Settings</Button>
    </div>
  );
}
