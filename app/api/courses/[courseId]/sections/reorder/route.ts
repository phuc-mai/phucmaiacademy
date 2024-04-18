import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId
      }
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.section.update({
        where: { id: item.id },
        data: { position: item.position }
      });
    }

    return new NextResponse("Reorder section list successfully", { status: 200 });
  } catch (error) {
    console.log("[reorder_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); 
  }
}