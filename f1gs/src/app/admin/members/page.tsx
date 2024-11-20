"use client";

// React / Next
import { useEffect, useState } from "react";

// Components
import Icon from "@/components/general/Icon";
import Select from "@/components/admin/members/Select";
import Modal from "@/components/general/Modal";
import SignupForm from "@/components/SignupForm";

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

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export default function Members() {
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    data: f1gsMembers,
    // error,
    isLoading,
  } = useQuery<F1GSMember[], Error>({
    queryKey: ["f1gsMembers"],
    queryFn: getAllEmailMembers,
    staleTime: 1000 * 60 * 10,
  });

  const [filterTags, setFilterTags] = useState<Array<string>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setPageNumber(1);
  }, [filterTags]);

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
      const aValue = a[sortColumn as StringKeys<F1GSMember>].toLowerCase();
      const bValue = b[sortColumn as StringKeys<F1GSMember>].toLowerCase();

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    })
    .filter(
      (member) =>
        filterTags.length === 0 ||
        member.tags.some((tag) => filterTags.includes(tag))
    )
    .filter((member) => member.name.includes(searchTerm));
  const totalPages = Math.ceil((sortedF1GSMembers?.length ?? 1) / 10);

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center shadow-lg rounded-lg mb-4 p-4 bg-white">
          <label className="flex flex-col">
            <input
              name="name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sandra Day O'Connor"
              required
              className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
            ></input>
            <span className="text-sm mt-1 ml-1">Member Name</span>
          </label>
          <label className="flex flex-col">
            <Select
              allOptions={Array.from(
                new Set(f1gsMembers?.flatMap((member) => member.tags)).values()
              ).filter((tag) => tag.includes("Class of"))}
              placeholder={"Class of..."}
              setFilterOptions={setFilterTags}
            ></Select>
            <span className="text-sm mt-1 ml-1">Year</span>
          </label>
          <label className="flex flex-col">
            <Select
              allOptions={Array.from(
                new Set(f1gsMembers?.flatMap((member) => member.tags)).values()
              ).filter((tag) => !tag.includes("Class of"))}
              placeholder={"Day"}
              setFilterOptions={setFilterTags}
            ></Select>
            <span className="text-sm mt-1 ml-1">Division</span>
          </label>
          <button
            className="flex flex-col items-center bg-brand_red p-2 rounded-lg font-semibold text-sm text-white hover:bg-brand_gold hover:text-black transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon size="md" url="/admin/plus.svg" alt="Add Member Icon" />
            Add Member
          </button>
        </div>
        <div className="relative max-h-[60vh] overflow-y-auto shadow-lg rounded-lg">
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
                        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                : sortedF1GSMembers
                    ?.slice(10 * (pageNumber - 1), 10 * pageNumber)
                    .map((member, idx) => (
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
          <div className="flex justify-center items-center mt-4 gap-x-2">
            <span
              className={`${
                totalPages > 1 ? "flex" : "hidden"
              } w-8 h-8  items-center justify-center bg-white shadow-lg rounded-lg cursor-pointer`}
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
            {pageNumber > 4 ? (
              <span className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg">
                ...
              </span>
            ) : (
              ""
            )}
            {totalPages > 4 &&
              [...Array(3)].map((val, idx) => {
                let value = Math.max(
                  1, // Ensure value is at least 1
                  Math.min(
                    pageNumber,
                    totalPages - 3 // Adjust to avoid negative or zero values
                  )
                );

                if (value === 1) {
                  value += 1;
                }
                value += idx;

                // Ensure `value` does not exceed the total number of pages
                if (value > totalPages) {
                  value = totalPages;
                }

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
            {pageNumber < totalPages - 3 ? (
              <span className="w-8 h-8 flex items-center justify-center bg-white shadow-lg rounded-lg">
                ...
              </span>
            ) : (
              ""
            )}
            <motion.span
              onClick={() => setPageNumber(totalPages)}
              whileHover={
                pageNumber !== totalPages
                  ? {
                      scale: 1.025,
                      translateY: -5,
                    }
                  : {}
              }
              className={`w-8 h-8 ${
                totalPages > 1 ? "flex" : "hidden"
              } items-center justify-center shadow-lg rounded-lg cursor-pointer ${
                sortedF1GSMembers?.length &&
                Math.ceil(sortedF1GSMembers?.length / 10) === pageNumber
                  ? "bg-brand_red text-white"
                  : "bg-white text-black"
              }`}
            >
              {totalPages}
            </motion.span>
            <span
              className={`${
                totalPages > 1 ? "flex" : "hidden"
              } w-8 h-8  items-center justify-center bg-white shadow-lg rounded-lg cursor-pointer`}
              onClick={() => handlePageUp()}
            >
              &#x27A1;
            </span>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Add F1GS Member"}
      >
        <SignupForm></SignupForm>
      </Modal>
    </div>
  );
}
