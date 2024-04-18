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
    <div className="p-6">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-6">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default Courses;
