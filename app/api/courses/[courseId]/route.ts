import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        instructorId: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.log("[courseId_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
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

    // for (const chapter of course.chapters) {
    //   if (chapter.muxData?.assetId) {
    //     await video.assets.delete(chapter.muxData.assetId);
    //   }
    // }

    await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json("Course deleted", { status: 200 });
  } catch (error) {
    console.log("[courseId_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
