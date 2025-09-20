import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, Facebook, Users, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata = {
  title: "Welcome to ACCITC! | Application Submitted",
  description: "Thank you for applying to join our IT club - join our community groups!",
};

export default function ThankYouPage() {
  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Icon with Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <CheckCircle className="h-20 w-20 text-[#74bf45] animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Exciting Congratulatory Message */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#74bf45] sm:text-5xl">
          🎉 Welcome to ACCITC! 🎉
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Your Application Has Been Submitted!
        </h2>
        
        <p className="mb-8 text-lg text-[#94a3b8]">
          Congratulations! You&apos;re one step closer to joining Bangladesh&apos;s most vibrant tech community. 
          We&apos;ll review your application and send you an email notification soon.
        </p>

        {/* Community Benefits */}
        <div className="mb-8 p-6 bg-gradient-to-r from-[#74bf45]/10 to-blue-500/10 rounded-lg border border-[#74bf45]/20">
          <h3 className="mb-4 text-xl font-semibold text-[#74bf45] flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Join Our Active Community Now!
          </h3>
          <p className="text-[#94a3b8] mb-4">
            Don&apos;t wait for approval - connect with 200+ tech enthusiasts right away! 
            Get event updates, project collaborations, and instant support from our amazing community.
          </p>
        </div>

        {/* Enhanced Group Join Buttons */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild size="lg" className="bg-[#74bf45] hover:bg-[#75c445] text-black font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link
                href="https://m.me/j/AbYTzMWlTECfzMmO/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold">Join Messenger Group</div>
                  <div className="text-sm opacity-90">Daily discussions & updates</div>
                </div>
              </Link>
            </Button>

            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link
                href="https://ig.me/j/Aba0aYuUMhFEmH-5/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold">Join Instagram Group</div>
                  <div className="text-sm opacity-90">Visual updates & stories</div>
                </div>
              </Link>
            </Button>
          </div>

          {/* Facebook Page Link */}
          <Button asChild size="lg" variant="outline" className="w-full py-6 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Link
              href="https://www.facebook.com/accitc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Facebook className="h-6 w-6" />
              <div className="text-left">
                <div className="font-bold">Follow Our Facebook Page</div>
                <div className="text-sm opacity-90">Latest news & event announcements</div>
              </div>
            </Link>
          </Button>
        </div>

        {/* Fallback Contact Information */}
        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-left">
            <strong>Having trouble with the links?</strong> No worries! Send us a message on our{" "}
            <Link 
              href="https://www.facebook.com/accitc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#74bf45] hover:underline font-semibold"
            >
              Facebook page
            </Link>
            {" "}or email us at{" "}
            <Link 
              href="mailto:itclub@acc.edu.bd"
              className="text-[#74bf45] hover:underline font-semibold"
            >
              itclub@acc.edu.bd
            </Link>
            {" "}and we&apos;ll help you join our groups manually.
          </AlertDescription>
        </Alert>

        {/* Return Home Button */}
        <div className="space-y-4">
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="/">Return to Home</Link>
          </Button>
          
          <p className="text-sm text-[#94a3b8]">
            🚀 Welcome to the future of tech at ACC! We can&apos;t wait to see what you&apos;ll create with us.
          </p>
        </div>
      </div>
    </main>
  );
}
