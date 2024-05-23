import { Rocket, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertBannerProps {
  isCompleted: boolean;
  missingFields: number;
  totalFields: number;
  page: string;
}
const AlertBanner = ({
  isCompleted,
  missingFields,
  totalFields,
  page,
}: AlertBannerProps) => {
  return (
    <Alert
      className="my-4"
      variant={`${isCompleted ? "default" : "destructive"}`}
    >
      {isCompleted ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className="text-xs font-medium">
        {missingFields} missing field(s) / {totalFields} required fields
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isCompleted
          ? "Great job! Ready to publish!"
          : page === "Edit Course"
          ? "You can only publish this course once all required fields including title, description, category, sub category, level, banner image, price and at least one section are completed."
          : "You can only publish this section once all required fields including title, description and video are completed."}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
