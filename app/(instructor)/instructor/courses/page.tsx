import Link from "next/link";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/course/Columns";

const Courses = async () => {
  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
