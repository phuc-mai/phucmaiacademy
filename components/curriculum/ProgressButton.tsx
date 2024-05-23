import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProgressButtonProps {
  courseId: string;
  sectionId: string;
  isCompleted: boolean;
}

const ProgressButton = ({
  courseId,
  sectionId,
  isCompleted,
}: ProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const completeSection = async () => {
    try {
      setIsLoading(true);
      axios.put(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
        isCompleted: !isCompleted,
      });
      toast.success("Progress updated");
      router.refresh();
    } catch (err) {
      console.log("Failed to mark as completed or incompleted");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant={isCompleted ? "completed" : "default"}
      onClick={completeSection}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isCompleted ? (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-2"/>
          Completed
        </div>
      ) : (
        "Mark as completed"
      )}
    </Button>
  );
};

export default ProgressButton;
