import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { sectionId: string } }
) {
  try {
    const { userId } = auth();
    const { name, fileUrl } = await req.json();

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

    const resource = await db.resource.create({
      data: {
        fileUrl,
        name,
        sectionId: params.sectionId,
      }
    });

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.log("resources_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}