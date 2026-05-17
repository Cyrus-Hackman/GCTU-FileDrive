import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignIn redirectUrl="/dashboard/files" afterSignInUrl="/dashboard/files" />
    </main>
  );
}
