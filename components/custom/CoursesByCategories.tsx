"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import getCoursesByCategory from "@/actions/getCourses";
import CourseCard from "@/components/course/CourseCard";
import { Category, Course } from "@prisma/client";

type CategoriesProps = {
  categories: Category[];
};

const CoursesByCategories: React.FC<CategoriesProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await getCoursesByCategory(selectedCategory);
        setCourses(fetchedCourses);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  const onClick = (categoryId: string | null) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deselect category
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // console.log(selectedCategory, courses, isLoading)

  return (
    <>
      <div className="flex flex-wrap gap-7 justify-center my-10">
        <Button
          variant="outline"
          className={`${selectedCategory === null ? "bg-[#FDAB04]" : ""}`}
          onClick={() => onClick(null)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className={`${selectedCategory === category.id ? "bg-[#FDAB04]" : ""}`}
            onClick={() => onClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-7">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </>
  );
};

export default CoursesByCategories;
