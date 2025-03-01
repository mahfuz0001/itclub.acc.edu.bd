import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login | IT Club Admin",
  description: "Login to the IT Club admin panel",
};

export default function LoginPage() {
  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Admin Login
          </h1>
          <p className="text-[#94a3b8]">Sign in to access the admin panel</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
