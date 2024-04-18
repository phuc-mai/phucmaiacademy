import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sectionId: string, resourceId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const section = await db.section.findUnique({
      where: {
        id: params.sectionId,
      }
    });

    if (!section) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.resource.delete({
      where: {
        sectionId: params.sectionId,
        id: params.resourceId,
      }
    });

    return NextResponse.json("Resource deleted", { status: 200 });
  } catch (error) {
    console.log("Resource_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
