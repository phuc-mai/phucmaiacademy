import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/course/Columns";

const Courses = async () => {
  const { userId } = auth();

  let courses = []

  if (userId) {
    courses = await db.course.findMany({
      where: {
        instructorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    return null
  }

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between">
        <Link href="/instructor/create-course">
          <Button>Create New Course</Button>
        </Link>
        <Link href="/instructor/performance" className="md:hidden">
          <Button>Performance</Button>
        </Link>
      </div>

      <div className="mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default Courses;
