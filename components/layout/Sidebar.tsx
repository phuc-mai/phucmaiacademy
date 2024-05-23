"use client"

import { MonitorPlay, BarChart4 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const routes = [
    {
      icon: <MonitorPlay />,
      label: "Courses",
      path: "/instructor/courses",
    },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium">
      {routes.map((route) => (
        <Link key={route.label} href={route.path} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB] ${pathname.startsWith(route.path) ? "bg-[#FDAB04] hover:bg-[#FDAB04]" : "" }`}>
          {route.icon}
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
