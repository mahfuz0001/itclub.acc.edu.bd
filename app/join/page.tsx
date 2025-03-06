import JoinForm from "@/components/join/join-form";

export const metadata = {
  title: "Join the IT Club",
  description: "Apply to become a member of ACC IT club",
};

export default function JoinPage() {
  return (
    <main className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Join the IT Club
          </h1>
          <p className="text-[#94a3b8]">
            Fill out the form below to apply for membership in our IT club
          </p>
        </div>
        <JoinForm />
      </div>
    </main>
  );
}
