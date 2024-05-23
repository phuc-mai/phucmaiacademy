import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Topbar from "@/components/layout/Topbar";
import CourseSidebar from "@/components/course/CourseSidebar";
import { db } from "@/lib/db";

const CourseDetailsLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {
  const { userId } = auth()

  if (!userId) {
    return redirect("/sign-in")
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        include: {
          progress: {
            where: {
              studentId: userId,
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <CourseSidebar course={course} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;