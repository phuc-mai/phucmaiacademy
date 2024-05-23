import { db } from "@/lib/db";
import { Course } from "@prisma/client";

const getCoursesByCategory = async (categoryId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    isPublished: true,
    ...(categoryId ? { categoryId } : {}),
  };

  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      category: true,
      sections: {
        where: {
          isPublished: true,
        },
      },
      subCategory: true,
      level: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
};

export default getCoursesByCategory;
