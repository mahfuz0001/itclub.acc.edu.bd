"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Send, 
  Settings, 
  MessageSquare, 
  Instagram,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

export default function EmailSettingsPage() {
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [isTestingSend, setIsTestingSend] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"unknown" | "configured" | "error">("unknown");
  const { toast } = useToast();

  useEffect(() => {
    checkEmailConfiguration();
  }, []);

  const checkEmailConfiguration = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          to: 'test@example.com',
          memberName: 'Test User',
        }),
      });

      if (response.status === 503) {
        setEmailStatus("error");
      } else {
        setEmailStatus("configured");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  const sendTestEmail = async (type: "welcome" | "rejection") => {
    if (!testEmail || !testName) {
      toast({
        title: "Error",
        description: "Please enter both email and name for testing.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingSend(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          to: testEmail,
          memberName: testName,
          messengerGroupLink: SITE_CONFIG.groupChats.messenger,
          instagramGroupLink: SITE_CONFIG.groupChats.instagram,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Test ${type} email sent successfully to ${testEmail}`,
        });
        setEmailStatus("configured");
      } else {
        throw new Error(result.error || 'Failed to send test email');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to send test email:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      if (errorMessage.includes('SMTP credentials')) {
        setEmailStatus("error");
      }
    } finally {
      setIsTestingSend(false);
    }
  };

  const getStatusBadge = () => {
    switch (emailStatus) {
      case "configured":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Configured
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Configured
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground">
            Configure and test email notifications for membership applications
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test">Test Emails</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Status</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {emailStatus === "configured" ? "Active" : 
                   emailStatus === "error" ? "Inactive" : "Unknown"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {emailStatus === "configured" 
                    ? "Email system is properly configured"
                    : emailStatus === "error"
                    ? "SMTP credentials need to be configured"
                    : "Checking email configuration..."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Group Chat Links</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-sm">
                      Messenger: {SITE_CONFIG.groupChats.messenger ? "✅" : "❌"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-3 w-3" />
                    <span className="text-sm">
                      Instagram: {SITE_CONFIG.groupChats.instagram ? "✅" : "❌"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {emailStatus === "error" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Email system is not configured. Please set up SMTP credentials in your environment variables.
                See the Configuration tab for more details.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Automated email notifications for membership applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">📧 Welcome Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Sent automatically when an application is approved. Includes welcome message, 
                  group chat links, and next steps.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">❌ Rejection Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Sent automatically when an application is rejected. Provides polite feedback 
                  and encouragement to apply again.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Notifications</CardTitle>
              <CardDescription>
                Send test emails to verify your email configuration is working properly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="testName">Test Name</Label>
                  <Input
                    id="testName"
                    placeholder="John Doe"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => sendTestEmail("welcome")}
                  disabled={isTestingSend || !testEmail || !testName}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Welcome Email
                </Button>
                <Button
                  onClick={() => sendTestEmail("rejection")}
                  disabled={isTestingSend || !testEmail || !testName}
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Rejection Email
                </Button>
              </div>

              {isTestingSend && (
                <Alert>
                  <Send className="h-4 w-4" />
                  <AlertDescription>
                    Sending test email... This may take a few seconds.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
              <CardDescription>
                Required environment variables for email functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">SMTP Settings</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><code className="bg-muted px-2 py-1 rounded">SMTP_HOST</code> - SMTP server hostname</div>
                    <div><code className="bg-muted px-2 py-1 rounded">SMTP_PORT</code> - SMTP server port (usually 587)</div>
                    <div><code className="bg-muted px-2 py-1 rounded">SMTP_USER</code> - Email username</div>
                    <div><code className="bg-muted px-2 py-1 rounded">SMTP_PASS</code> - Email password or app password</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Group Chat Links</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><code className="bg-muted px-2 py-1 rounded">NEXT_PUBLIC_MESSENGER_GROUP_LINK</code></div>
                    <div><code className="bg-muted px-2 py-1 rounded">NEXT_PUBLIC_INSTAGRAM_GROUP_LINK</code></div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Current Configuration:</h4>
                  <div className="space-y-1 text-sm font-mono">
                    <div>Messenger: {SITE_CONFIG.groupChats.messenger || "Not configured"}</div>
                    <div>Instagram: {SITE_CONFIG.groupChats.instagram || "Not configured"}</div>
                  </div>
                </div>

                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    For detailed setup instructions, see the <code>docs/EMAIL_SYSTEM.md</code> file 
                    in your project directory.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}