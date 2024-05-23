import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 

    const progress = await db.progress.upsert({
      where: {
        studentId_sectionId: {
          studentId: userId,
          sectionId: params.sectionId,
        }
      },
      update: {
        isCompleted
      },
      create: {
        studentId: userId,
        sectionId: params.sectionId,
        isCompleted,
      }
    })

    return NextResponse.json(progress);
  } catch (error) {
    console.log("[sectionId_progress_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}