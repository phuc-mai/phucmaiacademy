"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/custom/SearchInput";

const Topbar = () => {
  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
    { label: "Learning", path: "/learning" },
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

        <div className="relative flex gap-4 items-center z-20">
          <Menu
            className="cursor-pointer sm:hidden"
            onClick={() => setDropdownMenu(!dropdownMenu)}
          />
          {dropdownMenu && (
            <div className="absolute top-7 right-1 flex flex-col gap-5 p-3 bg-white shadow-2xl rounded-lg">
              {topRoutes.map((route) => (
                <Link
                  href={route.path}
                  key={route.path}
                  className="flex gap-4 text-sm font-medium hover:text-[#FDAB04]"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          )}
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
