import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import EditSectionForm from "@/components/curriculum/EditSectionForm";
import AlertBanner from "@/components/custom/AlertBanner";

const SectionDetails = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/login");
  }

  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      resources: true,
      muxData: true,
    },
  });

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }

  const requiredFields = [section.title, section.description, section.videoUrl];

  const totalFields = requiredFields.length;
  const missingFields = requiredFields.filter(
    (field) => !Boolean(field)
  ).length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFields={missingFields}
        totalFields={totalFields}
        page="Edit Section"
      />
      <EditSectionForm
        section={section}
        courseId={params.courseId}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default SectionDetails;
