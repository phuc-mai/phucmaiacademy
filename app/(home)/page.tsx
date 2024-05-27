import getCoursesByCategory from "@/actions/getCourses";
import CourseCard from "@/components/course/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";
import Image from "next/image";

const Home = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const courses = await getCoursesByCategory(null);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      {/* <Image
        src="/home_banner.png"
        alt="banner"
        width={1500}
        height={700}
        className="md:rounded-3xl"
      /> */}
      <Categories categories={categories} selectedCategory={null} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Home;
