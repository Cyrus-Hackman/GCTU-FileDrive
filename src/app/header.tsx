"use client";

import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const clerkAppearance = isDark ? { baseTheme: dark } : undefined;

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 py-4 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 supports-[backdrop-filter]:bg-white/60">
      <div className="items-center container mx-auto justify-between flex gap-4 px-6">
        <Link href="/" className="flex gap-3 items-center text-xl font-bold tracking-tight text-slate-900 dark:text-white group">
          <Image 
            src="/logo.png" 
            width="40" 
            height="40" 
            alt="file drive logo" 
            className="rounded-xl shadow-sm transition-transform group-hover:scale-105" 
          />
          <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            GCTU FileDrive
          </span>
        </Link>

        <SignedIn>
          <Button variant={"outline"} asChild className="ml-auto hidden md:flex rounded-full px-6 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/dashboard/files">Your Files</Link>
          </Button>
        </SignedIn>

        <div className="flex gap-3 items-center ml-auto md:ml-0">
          <OrganizationSwitcher appearance={clerkAppearance} />
          <UserButton appearance={clerkAppearance} />
          <ModeToggle />
          <SignedOut>
            <SignInButton afterSignInUrl="/dashboard/files" afterSignUpUrl="/dashboard/files">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
