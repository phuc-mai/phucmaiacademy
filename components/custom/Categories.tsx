"use client"

import { Category } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface CatagoriesProps {
  categories: Category[]
  selectedCategory: string | null
}

const Categories = ({ categories, selectedCategory }: CatagoriesProps) => {
  const router = useRouter();

  const onClick = (categoryId: string | null) => {
    router.push(categoryId ? `/categories/${categoryId}` : "/");
  };

  return (
    <div className="px-4 flex flex-wrap gap-7 justify-center my-10">
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
          className={`${
            selectedCategory === category.id ? "bg-[#FDAB04]" : ""
          }`}
          onClick={() => onClick(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
