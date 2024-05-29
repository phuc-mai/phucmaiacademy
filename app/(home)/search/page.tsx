import { Course } from "@prisma/client";

import CourseCard from "@/components/course/CourseCard";
import { db } from "@/lib/db";

const fetchCourses = async (query: string): Promise<Course[]> => {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          category: {
            name: {
              contains: query,
            },
          },
        },
      ],
    },
    include: {
      category: true,
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
};

const SearchPage = async ({ searchParams }: { searchParams: { query: string } }) => {
  const queryText = searchParams.query || "";
  const courses = await fetchCourses(queryText);

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">
        Recommended courses for {queryText}
      </p>
      <div className="flex gap-4 flex-wrap">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
