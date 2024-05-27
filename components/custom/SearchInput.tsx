"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search?query=${query}`);
    }
    setQuery("")
  };

  return (
    <div className="max-md:hidden w-[400px] rounded-full flex">
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
        placeholder="Search for courses"
      />
      <button
        className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/80"
        onClick={handleSearch}
        disabled={query === ""}
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchInput;
