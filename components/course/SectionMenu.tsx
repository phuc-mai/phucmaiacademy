"use client";

import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SectionMenu = ({
  course,
}: {
  course: Course & { sections: Section[] };
}) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  return (
    <div className="relative md:hidden">
      <Button onClick={() => setDropdownMenu(!dropdownMenu)}>
        Section Menu
      </Button>

      {dropdownMenu && (
        <div className="absolute w-[250px] top-12 left-1 flex flex-col text-sm font-medium bg-white shadow-2xl rounded-lg z-20">
          <Link href={`/courses/${course.id}/overview`} className="p-3 rounded-lg hover:bg-[#FFF8EB]">
            Overview
          </Link>
          {course.sections.map((section) => (
            <Link
              key={section.id}
              href={`/courses/${course.id}/sections/${section.id}`}
              className="p-3 rounded-lg hover:bg-[#FFF8EB]"
            >
              {section.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionMenu;
