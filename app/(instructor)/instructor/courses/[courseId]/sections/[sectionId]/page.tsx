import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import EditSectionForm from "@/components/curriculum/EditSectionForm";

const SectionDetails = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      resources: true,
    },
  });

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }
  return <EditSectionForm section={section} courseId={params.courseId} />;
};

export default SectionDetails;
