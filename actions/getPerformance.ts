import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & { course: Course };

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getPerformance = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: { course: { instructorId: userId } },
      include: { course: true },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, current) => acc + current.total, 0);
    const totalSales = data.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (err) {
    console.log("[getPerformance]", err);
    return {
      data: [],
      totalRevenue: 0,
    };
  }
};
