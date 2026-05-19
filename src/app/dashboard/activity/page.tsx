"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon, Loader2, ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityPage() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  const orgId = organization?.id ?? user?.id;

  const activities = useQuery(
    api.activity.getActivity,
    orgId ? { orgId } : "skip"
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case "uploaded":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "deleted":
      case "marked for deletion":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "restored":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "favorited":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "unfavorited":
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800";
      case "commented on":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ActivityIcon className="w-8 h-8 text-orange-500" /> 
          Organization Activity
        </h1>
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Recent Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {activities === undefined && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-orange-500" />
              <p>Loading activity feed...</p>
            </div>
          )}

          {activities?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <ActivityIcon className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No activity yet</p>
              <p className="text-sm">Actions taken by users in this organization will appear here.</p>
            </div>
          )}

          <div className="space-y-6">
            {activities?.map((activity) => (
              <div key={activity._id} className="flex gap-4 items-start relative">
                {/* Timeline connector */}
                <div className="absolute top-10 left-5 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-800 last:hidden" />
                
                <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-900 shadow-sm z-10">
                  <AvatarImage src={activity.user.image} />
                  <AvatarFallback>{activity.user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <span className="font-semibold text-base">
                      {activity.user.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelative(new Date(activity._creationTime), new Date())}
                    </span>
                  </div>
                  
                  <div className="text-sm flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </span>
                    {activity.file && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                        <FileIcon className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{activity.file.name}</span>
                      </span>
                    )}
                  </div>
                  
                  {activity.details && (
                    <div className="mt-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 italic">
                      &quot;{activity.details}&quot;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
