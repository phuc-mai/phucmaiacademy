import { clerkClient } from "@clerk/nextjs";
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@prisma/client";
import { db } from "@/lib/db";

const CourseCard = async ({ course }: { course: Course }) => {
  const instructor = await clerkClient.users.getUser(course.instructorId);

  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: { id: course.levelId },
    });
  }

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="border rounded-xl cursor-pointer"
    >
      <Image
        src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
        alt={course.title}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />
      <div className="px-4 py-2 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:text-[#FDAB04]">
          {course.title}
        </h2>
        <div className="flex justify-between text-sm font-medium">
          {instructor && (
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
              <p>{`${instructor.firstName} ${instructor.lastName}`}</p>
            </div>
          )}
          {level && (
            <div className="flex gap-2 items-center">
              <Gem size={20} />
              <p>{level.name}</p>
            </div>
          )}
        </div>
        <p className="text-md font-bold">$ {course.price}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
