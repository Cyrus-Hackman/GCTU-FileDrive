import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Share2, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-20 lg:px-8 pb-24 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-4xl py-12">
          <div className="text-center flex flex-col items-center">
            <div className="mb-8 p-1 rounded-3xl bg-gradient-to-b from-blue-500/20 to-transparent">
              <Image
                src="/logo.png"
                width="120"
                height="120"
                alt="GCTU Logo"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 pb-4">
              Secure Cloud Storage for GCTU
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
              A premium, fast, and secure file management platform designed specifically for the students and faculty of Ghana Communication Technology University.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard/files"
                className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for Academic Excellence
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold leading-7">Secure by Default</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Enterprise-grade encryption and strict access controls ensure your academic documents and research are always protected.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                  <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold leading-7">Seamless Sharing</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Collaborate effortlessly with study groups and professors. Share files instantly across the entire university network.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold leading-7">Lightning Fast</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Powered by a modern edge network. Experience instantaneous uploads and zero-latency file retrieval on campus or off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
