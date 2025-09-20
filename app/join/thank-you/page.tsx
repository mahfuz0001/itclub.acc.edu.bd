import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";

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
        <div className="space-y-3 flex flex-col sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="secondary" className="ml-3">
            <Link
              href="https://m.me/j/AbYTzMWlTECfzMmO/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Join Official Messenger Group
            </Link>
          </Button>
          <Button asChild variant="secondary" className="ml-3">
            <Link
              href="https://ig.me/j/Aba0aYuUMhFEmH-5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Join Official IG
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
