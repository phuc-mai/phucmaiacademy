import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
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
        instructorId: userId,
      }
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const section = await db.section.findUnique({
      where: {
        id: params.sectionId,
        courseId: params.courseId,
      }
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    // if (section.videoUrl) {
    //   const existingMuxData = await db.muxData.findFirst({
    //     where: {
    //       chapterId: params.section,
    //     }
    //   });

    //   if (existingMuxData) {
    //     await video.assets.delete(existingMuxData.assetId);
    //     await db.muxData.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       }
    //     });
    //   }
    // }

    await db.section.delete({
      where: {
        courseId: params.courseId,
        id: params.sectionId
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

    return NextResponse.json("Section Deleted", { status: 200 });
  } catch (error) {
    console.log("[sectionId_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}