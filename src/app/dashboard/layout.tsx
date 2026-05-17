import { SideNav } from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-8 min-h-screen px-4 pb-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 w-full shrink-0">
          <SideNav />
        </div>
        <div className="w-full min-w-0 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </main>
  );
}
