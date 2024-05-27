import getCoursesByCategory from "@/actions/getCourses";
import CourseCard from "@/components/course/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";

const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const courses = await getCoursesByCategory(params.categoryId);

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={params.categoryId} />
      <div className="flex flex-wrap gap-7">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
