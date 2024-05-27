import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import { clerkClient } from "@clerk/nextjs";
import Image from "next/image";
import SectionMenu from "@/components/course/SectionMenu";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const instructor = await clerkClient.users.getUser(course.instructorId);

  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  } else {
    level = null;
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <SectionMenu course={course} />
      </div>
      <p className="font-medium">{course.subtitle}</p>

      <div className="flex gap-2 items-center">
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : "/avatar_placeholder.jpg"
          }
          alt="profile-photo"
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor: </p>
        <p>{`${instructor.firstName} ${instructor.lastName}`}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Price: </p>
        <p>${course?.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level: </p>
        <p>{level?.name}</p>
      </div>

      <div>
        <p className="font-bold">Description</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
