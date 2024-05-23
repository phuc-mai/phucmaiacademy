"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/custom/SearchInput";

const Topbar = () => {
  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
    { label: "Learning", path: "/learning" },
  ];

  const { userId } = useAuth();

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
        <div className="flex gap-6">
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
