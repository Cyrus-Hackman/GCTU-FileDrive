import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelative } from "date-fns";
import { TrashIcon, Loader2 } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";

export function FileComments({
  file,
  isOpen,
  setIsOpen,
}: {
  file: Doc<"files">;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const orgId = organization?.id ?? user?.id;

  const comments = useQuery(
    api.comments.getComments,
    orgId ? { fileId: file._id, orgId } : "skip"
  );
  
  const me = useQuery(api.users.getMe);
  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !orgId) return;

    setIsSubmitting(true);
    try {
      await addComment({
        fileId: file._id,
        orgId,
        text: newComment,
      });
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle className="text-xl">Comments: {file.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
            {comments === undefined && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
            
            {comments?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No comments yet.</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
            )}

            {comments?.map((comment) => (
              <div key={comment._id} className="flex gap-3 group">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={comment.user.image} />
                  <AvatarFallback>{comment.user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-sm">
                      {comment.user.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatRelative(new Date(comment._creationTime), new Date())}
                    </span>
                  </div>
                  <div className="text-sm mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg relative">
                    {comment.text}
                    {me?._id === comment.userId && (
                      <button
                        onClick={() => deleteComment({ commentId: comment._id })}
                        className="absolute -right-2 -top-2 bg-red-100 dark:bg-red-900/30 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                        title="Delete comment"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
