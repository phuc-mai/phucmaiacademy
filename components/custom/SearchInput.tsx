"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const SearchInput = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="md:w-[400px] rounded-full flex">
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
        placeholder="Search for courses, instructors,..."
      />
      <button className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/80">
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchInput;
