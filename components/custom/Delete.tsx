"use client";

import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


interface DeleteProps {
  item: string;
  courseId: string;
  sectionId?: string;
}

const Delete: React.FC<DeleteProps> = ({ item, courseId, sectionId }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const url = item === "course" ? `/api/courses/${courseId}` : `/api/courses/${courseId}/sections/${sectionId}`;
      const res = await fetch(url, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setIsDeleting(false);
        const pushUrl = item === "course" ? "/instructor/courses" : `/instructor/courses/${courseId}/sections`;
        router.push(pushUrl);
        router.refresh();
        toast.success(`${item} deleted`);
      }
    } catch (error) {
      console.log(`Failed to delete ${item}`, error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash className="w-4 h-4" />
          )}{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#FDAB04]" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
