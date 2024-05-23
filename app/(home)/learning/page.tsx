import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import CourseCard from "@/components/course/CourseCard";

const Learning = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const purchasedCourses = await db.purchase.findMany({
    where: {
      customerId: userId,
    },
    select: {
      course: {
        include: {
          category: true,
          subCategory: true,
          sections: {
            where: {
              isPublished: true,
            },
          },
        },
      }
    }
  });

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 flex flex-wrap gap-7">
      {purchasedCourses.map((purchase) => (
        <CourseCard key={purchase.course.id} course={purchase.course} />
      ))}
    </div>
  );
};

export default Learning;
