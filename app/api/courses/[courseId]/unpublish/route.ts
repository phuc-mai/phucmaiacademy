import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not found", { status: 404 });
    }


    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
      data: {
        isPublished: false,
      }
    });


    return NextResponse.json(unpublishedCourse, { status: 200 });
  } catch (error) {
    console.log("[courseId_unpublish_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}