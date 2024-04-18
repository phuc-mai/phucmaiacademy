import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import EditCourseForm from "@/components/course/EditCourseForm";

const CourseBasic = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const levels = await db.level.findMany();

  return (
    <EditCourseForm
      course={course}
      categories={categories.map((category) => ({
        label: category.name,
        value: category.id,
        subCategories: category.subCategories.map((subCategory) => ({
          label: subCategory.name,
          value: subCategory.id,
        })),
      }))}
      levels={levels.map((level) => ({
        label: level.name,
        value: level.id,
      }))}
    />
  );
};

export default CourseBasic;
