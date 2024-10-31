"use client";

// React / Next
import { useState } from "react";

// Types
import { F1GSMember, MailchimpMember } from "@/lib/types";

// 3rd Party Libraries
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

async function getAllEmailMembers() {
  const membersResponse = await fetch("/api/mailchimp?action=getAllMembers");
  const {
    data: { members },
  } = await membersResponse.json();
  return members.map((member: MailchimpMember) => ({
    name: member.full_name,
    email: member.email_address,
    tags: member.tags.map((tag) => tag.name),
  }));
}

export default function Members() {
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    data: f1gsMembers,
    error,
    isLoading,
  } = useQuery<F1GSMember[], Error>({
    queryKey: ["f1gsMembers"],
    queryFn: getAllEmailMembers,
  });

  const [tagOptions, setTagOptions] = useState<Set<string>>(
    new Set(f1gsMembers?.flatMap((member) => member.tags))
  );
  const [filterTags, setFilterTags] = useState<Array<string>>([]);

  const handleSort = (column: "name" | "email") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handlePageDown = () => {
    if (pageNumber > 1) {
      setPageNumber((currentPageNumber) => currentPageNumber - 1);
    }
  };

  const handlePageUp = () => {
    if (pageNumber < Math.ceil((f1gsMembers?.length ?? 1) / 10)) {
      setPageNumber((currentPageNumber) => currentPageNumber + 1);
    }
  };

  const sortedF1GSMembers = f1gsMembers
    ?.sort((a, b) => {
      const aValue = a[sortColumn as keyof F1GSMember].toLowerCase();
      const bValue = b[sortColumn as keyof F1GSMember].toLowerCase();

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    })
    // .filter((member) => )
    .slice(10 * (pageNumber - 1), 10 * pageNumber);

  // filter to include only those members who have at least 1 tag in

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <div className="relative max-h-[70vh] overflow-y-auto shadow-lg rounded-lg">
          <table className="table-auto border-collapse text-left w-full bg-white">
            <thead className="sticky top-0">
              <tr className="bg-brand_red">
                <th
                  onClick={() => handleSort("name")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Name{" "}
                  <span className="text-xs">
                    {sortColumn === "name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Email{" "}
                  <span className="text-xs">
                    {sortColumn === "email" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(10)].map((val, idx) => (
                    <tr key={idx}>
                      <td className="p-4">
                        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                : sortedF1GSMembers?.map((member, idx) => (
                    <tr
                      key={member.name + " " + idx}
                      className={`hover:bg-gray-200 transition-colors ${
                        idx === sortedF1GSMembers.length - 1
                          ? ""
                          : "border-b border-slate-300"
                      }`}
                    >
                      <td className="p-4 flex items-center space-x-4">
                        <h3 className="text-gray-700">{member.name}</h3>
                      </td>
                      <td className="p-4 text-gray-700">{member.email}</td>
                      <td className="p-4 text-gray-700">
                        {member.tags.join(", ")}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {isLoading ? (
          ""
        ) : (
          <div className="flex justify-center mt-4 gap-x-2">
            <span
              className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg cursor-pointer"
              onClick={() => handlePageDown()}
            >
              &#x2B05;
            </span>
            <motion.span
              whileHover={
                pageNumber !== 1
                  ? {
                      scale: 1.025,
                      translateY: -5,
                    }
                  : {}
              }
              className={`w-8 h-8 flex items-center justify-center shadow-lg rounded-lg cursor-pointer ${
                pageNumber === 1
                  ? "bg-brand_red text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setPageNumber(1)}
            >
              1
            </motion.span>
            {pageNumber > 10 ? (
              <span className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg">
                ...
              </span>
            ) : (
              ""
            )}
            {[...Array(3)].map((val, idx) => {
              let value = Math.min(
                pageNumber,
                Math.ceil((f1gsMembers?.length ?? 1) / 10) - 3
              );

              if (value === 1) {
                value += 1;
              }
              value += idx;

              return (
                <motion.span
                  key={value}
                  whileHover={
                    pageNumber !== value
                      ? {
                          scale: 1.025,
                          translateY: -5,
                        }
                      : {}
                  }
                  onClick={() => setPageNumber(value)}
                  className={`w-8 h-8 flex items-center justify-center shadow-lg rounded-lg cursor-pointer ${
                    pageNumber === value
                      ? "bg-brand_red text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {value}
                </motion.span>
              );
            })}
            {pageNumber < Math.ceil((f1gsMembers?.length ?? 1) / 10) - 10 ? (
              <span className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg">
                ...
              </span>
            ) : (
              ""
            )}
            <motion.span
              onClick={() =>
                setPageNumber(Math.ceil((f1gsMembers?.length ?? 1) / 10))
              }
              whileHover={
                pageNumber !== Math.ceil((f1gsMembers?.length ?? 1) / 10)
                  ? {
                      scale: 1.025,
                      translateY: -5,
                    }
                  : {}
              }
              className={`w-8 h-8 flex items-center justify-center shadow-lg rounded-lg cursor-pointer ${
                f1gsMembers?.length &&
                Math.ceil(f1gsMembers?.length / 10) === pageNumber
                  ? "bg-brand_red text-white"
                  : "bg-white text-black"
              }`}
            >
              {f1gsMembers?.length && Math.ceil(f1gsMembers?.length / 10)}
            </motion.span>
            <span
              className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg cursor-pointer"
              onClick={() => handlePageUp()}
            >
              &#x27A1;
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
