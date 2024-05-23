import { Progress } from "@/components/ui/progress";

const CourseProgress = ({ value }: { value: number }) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={value === 100 ? "success" : "default"} />
      <p className="text-xs">{Math.round(value)}% Completed</p>
    </div>
  );
};

export default CourseProgress;
