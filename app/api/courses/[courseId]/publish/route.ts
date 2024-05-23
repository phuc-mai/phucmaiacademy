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
      include: {
        sections: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Course Not found", { status: 404 });
    }

    const hasPublishedSection = course.sections.some((section) => section.isPublished);

    if (!course.title || !course.description || !course.categoryId ||!course.subCategoryId ||!course.levelId || !course.imageUrl || !course.price || !hasPublishedSection) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (error) {
    console.log("[courseId_publish_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } 
}