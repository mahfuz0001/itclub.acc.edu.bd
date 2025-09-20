import JoinForm from "@/components/join/join-form";

export const metadata = {
  title: "Join ACCITC - Bangladesh's Elite Tech Community",
  description: "Apply to become a member of ACC IT club - Join 200+ tech innovators building the future",
};

export default function JoinPage() {
  return (
    <main className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          {/* Enhanced Header with Emojis and Appeal */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-[#74bf45]/10 text-[#74bf45] rounded-full text-sm font-semibold border border-[#74bf45]/20">
              🔥 Join 200+ Elite Tech Students
            </span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl text-[#74bf45]">
            🚀 Join Bangladesh&apos;s Most Elite Tech Community
          </h1>
          <p className="text-lg text-[#94a3b8] mb-4">
            Transform your passion into expertise with exclusive workshops, real projects, and direct mentorship from industry experts.
          </p>
          
          {/* Benefits Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="font-semibold text-blue-400">💼 Industry Connections</div>
              <div className="text-[#94a3b8]">Direct access to top tech companies</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-lg border border-green-500/20">
              <div className="font-semibold text-green-400">🏆 50+ Events/Year</div>
              <div className="text-[#94a3b8]">Workshops, competitions & networking</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
              <div className="font-semibold text-purple-400">🚀 Real Projects</div>
              <div className="text-[#94a3b8]">Build portfolio with actual impact</div>
            </div>
          </div>
          
          <p className="text-[#94a3b8]">
            Fill out the form below to secure your spot in our exclusive community
          </p>
        </div>
        <JoinForm />
      </div>
    </main>
  );
}
