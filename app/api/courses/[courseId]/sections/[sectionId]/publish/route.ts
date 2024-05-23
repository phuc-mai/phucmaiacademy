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

    const section = await db.section.findUnique({
      where: {
        id: params.sectionId,
        courseId: params.courseId,
      }
    });

    const muxData = await db.muxData.findUnique({
      where: {
        sectionId: params.sectionId,
      }
    });

    if (!section || !muxData || !section.title || !section.description || !section.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedSection = await db.section.update({
      where: {
        id: params.sectionId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedSection, { status: 200 });
  } catch (error) {
    console.log("[section_publish_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); 
  }
}