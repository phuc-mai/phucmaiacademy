import { Course, Progress, Section } from "@prisma/client";
import Link from "next/link";

import CourseProgress from "@/components/custom/CourseProgress";
import { db } from "@/lib/db";

interface CourseSidebarProps {
  course: Course & {
    sections: (Section & {
      progress: Progress[] | null;
    })[];
  };
  studentId: string
}

const CourseSidebar = async ({ course, studentId }: CourseSidebarProps) => {
  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id
      }
    }
  })

  const publishedSections = await db.section.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    select: {
      id: true,
    }
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const completedSections = await db.progress.count({
    where: {
      studentId: studentId,
      sectionId: {
        in: publishedSectionIds,
      },
      isCompleted: true,
    }
  });

  const progressPercentage = (completedSections / publishedSectionIds.length) * 100;

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-4 text-sm font-medium">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && <CourseProgress value={progressPercentage} />}
      <Link
        href={`/courses/${course.id}/overview`}
        className="p-3 rounded-lg hover:bg-[#FFF8EB] mt-4"
      >
        Overview
      </Link>
      {/* <div className="flex flex-col gap-4"> */}
      {course.sections.map((section) => (
        <Link
          key={section.id}
          href={`/courses/${course.id}/sections/${section.id}`}
          className="p-3 rounded-lg hover:bg-[#FFF8EB]"
        >
          {section.title}
        </Link>
      ))}
      {/* </div> */}
    </div>
  );
};

export default CourseSidebar;
