import CoursesByCategories from "@/components/custom/CoursesByCategories";
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

  return (
    <div className="md:mt-5 md:px-10 xl:px-16">
      <Image
        src="/home_banner.png"
        alt="banner"
        width={1500}
        height={700}
        className="md:rounded-3xl"
      />
      
      <CoursesByCategories categories={categories} />
    </div>
  );
};

export default Home;
