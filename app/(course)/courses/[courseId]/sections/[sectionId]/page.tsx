import { db } from "@/lib/db";
import SectionDetails from "@/components/curriculum/SectionDetails";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Resource, Section } from "@prisma/client";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const courseId = params.courseId
  const sectionId = params.sectionId

  const { userId } = auth();

  if (!userId) {
    return redirect(`/courses/${courseId}/sections/overview`);
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      sections: true
    }
  });

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      isPublished: true,
    },
  });

  if (!section || !course) {
    throw new Error("Section or course not found");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: userId,
        courseId: courseId,
      },
    },
  });

  let muxData = null;
  let resources: Resource[] = [];
  let nextSection: Section | null = null;

  if (purchase) {
    resources = await db.resource.findMany({
      where: {
        sectionId: sectionId,
      },
    });
  }

  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
      where: {
        sectionId: sectionId,
      },
    });

    nextSection = await db.section.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: section?.position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  const progress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: userId,
        sectionId,
      },
    },
  });

  return (
    <SectionDetails section={section} course={course} purchase={purchase} muxData={muxData} resources={resources} progress={progress} />
  );
};

export default SectionDetailsPage;
