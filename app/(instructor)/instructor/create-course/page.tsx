import NewCourseForm from "@/components/course/NewCourseForm";
import { db } from "@/lib/db";

const CreateCourse = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true, 
    }
  });

  return (
    <NewCourseForm
      categories={categories.map((category) => ({
        label: category.name,
        value: category.id,
        subCategories: category.subCategories.map((subCategory) => ({
          label: subCategory.name,
          value: subCategory.id,
        })),
      }))}
    />
  );
};

export default CreateCourse;
