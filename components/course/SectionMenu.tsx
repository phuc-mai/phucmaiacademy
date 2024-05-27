"use client";

import { Course, Section } from "@prisma/client";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SectionMenu = ({
  course,
}: {
  course: Course & { sections: Section[] };
}) => {
  return (
    <div className="w-fulll max-w-[200px] z-20 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Button>Section Menu</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <Link
            href={`/courses/${course.id}/overview`}
            className="p-3 rounded-lg hover:bg-[#FFF8EB]"
          >
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionMenu;
