import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignUp redirectUrl="/dashboard/files" afterSignUpUrl="/dashboard/files" />
    </main>
  );
}
