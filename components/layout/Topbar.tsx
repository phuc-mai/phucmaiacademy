"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/custom/SearchInput";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const Topbar = () => {
  const pathname = usePathname();

  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
    { label: "Learning", path: "/learning" },
  ];

  const sideRoutes = [
    {
      label: "Courses",
      path: "/instructor/courses",
    },
    {
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const { userId } = useAuth();

  const [dropdownMenu, setDropdownMenu] = useState(false);

  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Phuc Mai Academy"
          width={200}
          height={100}
        />
      </Link>

      <SearchInput />

      <div className="flex gap-6 items-center">
        <div className="max-sm:hidden flex gap-6">
          {topRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="text-sm font-medium hover:text-[#FDAB04]"
            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="w-full max-w-[200px] z-20 sm:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {topRoutes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="text-sm font-medium hover:text-[#FDAB04]"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
              {pathname.startsWith("/instructor") && (
                <div className="flex flex-col gap-4">
                  {sideRoutes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="text-sm font-medium hover:text-[#FDAB04]"
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {userId ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button>Log In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
