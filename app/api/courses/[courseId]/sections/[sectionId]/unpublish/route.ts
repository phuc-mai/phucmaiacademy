import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId
      }
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedSection = await db.section.update({
      where: {
        id: params.sectionId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      }
    });

    if (!publishedSectionsInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedSection, { status: 200 });
  } catch (error) {
    console.log("[sectionId_unpublish_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); 
  }
}