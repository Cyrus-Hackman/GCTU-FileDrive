"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row md:flex-col gap-2 w-full overflow-x-auto pb-4 md:pb-0 md:pr-4 sticky top-24">
      <div className="text-sm font-semibold text-muted-foreground px-3 pb-2 hidden md:block">
        Navigation
      </div>
      
      <Link href="/dashboard/files" className="block">
        <Button
          variant={"ghost"}
          className={clsx("flex gap-3 w-full justify-start px-4 py-6 rounded-2xl transition-all duration-200", {
            "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold shadow-sm border border-blue-100 dark:border-blue-900/50": pathname.includes("/dashboard/files"),
            "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent": !pathname.includes("/dashboard/files"),
          })}
        >
          <FileIcon className={clsx("w-5 h-5", pathname.includes("/dashboard/files") ? "text-blue-600 dark:text-blue-400" : "")} /> 
          All Files
        </Button>
      </Link>

      <Link href="/dashboard/favorites" className="block">
        <Button
          variant={"ghost"}
          className={clsx("flex gap-3 w-full justify-start px-4 py-6 rounded-2xl transition-all duration-200", {
            "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm border border-indigo-100 dark:border-indigo-900/50": pathname.includes("/dashboard/favorites"),
            "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent": !pathname.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon className={clsx("w-5 h-5", pathname.includes("/dashboard/favorites") ? "text-indigo-600 dark:text-indigo-400" : "")} /> 
          Favorites
        </Button>
      </Link>

      <Link href="/dashboard/trash" className="block">
        <Button
          variant={"ghost"}
          className={clsx("flex gap-3 w-full justify-start px-4 py-6 rounded-2xl transition-all duration-200", {
            "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-semibold shadow-sm border border-red-100 dark:border-red-900/50": pathname.includes("/dashboard/trash"),
            "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent": !pathname.includes("/dashboard/trash"),
          })}
        >
          <TrashIcon className={clsx("w-5 h-5", pathname.includes("/dashboard/trash") ? "text-red-600 dark:text-red-400" : "")} /> 
          Trash
        </Button>
      </Link>

      <Link href="/dashboard/activity" className="block">
        <Button
          variant={"ghost"}
          className={clsx("flex gap-3 w-full justify-start px-4 py-6 rounded-2xl transition-all duration-200", {
            "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-semibold shadow-sm border border-orange-100 dark:border-orange-900/50": pathname.includes("/dashboard/activity"),
            "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent": !pathname.includes("/dashboard/activity"),
          })}
        >
          <ActivityIcon className={clsx("w-5 h-5", pathname.includes("/dashboard/activity") ? "text-orange-600 dark:text-orange-400" : "")} /> 
          Activity
        </Button>
      </Link>
    </div>
  );
}
