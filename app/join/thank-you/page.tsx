import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Application Submitted | IT Club",
  description: "Thank you for applying to join our IT club",
};

export default function ThankYouPage() {
  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-[#3b82f6]" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Application Submitted!
        </h1>
        <p className="mb-6 text-[#94a3b8]">
          Thank you for applying to join our IT club. We've received your
          application and will review it shortly. You'll receive an email
          notification about the status of your application.
        </p>
        <div className="space-y-2">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
