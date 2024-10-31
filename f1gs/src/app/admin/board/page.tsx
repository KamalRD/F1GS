"use client";

// React & Next
import Image from "next/image";
import { ChangeEvent, ReactNode, useState } from "react";

// Components
import EditBoardForm from "@/components/admin/EditBoardForm";
import Icon from "@/components/general/Icon";
import Modal from "@/components/general/Modal";

// Functions
import { getBoardMembers } from "@/lib/subapase/routes";

// Types
import { BoardMember } from "@/lib/types";

// 3rd Partys
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import CreateBoardMember from "@/components/admin/CreateBoardMember";
import DeleteBoardMember from "@/components/admin/DeleteBoardMember";

const searchSchema = z.object({
  name: z.string(),
  position: z.string(),
});

export default function Board() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);

  const [sortedColumn, setSortedColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [searchOptions, setSearchOptions] = useState<
    z.infer<typeof searchSchema>
  >({
    name: "",
    position: "",
  });

  const {
    data: members,
    error,
    isLoading,
  } = useQuery<BoardMember[], Error>({
    queryKey: ["boardMembers"],
    queryFn: getBoardMembers,
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchOptions({ ...searchOptions, [name]: value });
  };

  const handleIconClick = (action: string, member?: BoardMember) => {
    if (action === "edit" && member) {
      setModalTitle("Edit Board Member");
      setModalContent(
        <EditBoardForm
          memberToEdit={member}
          setModalIsOpen={setIsModalOpen}
          setModalTitle={setModalTitle}
        ></EditBoardForm>
      );
    } else if (action === "delete" && member) {
      setModalTitle("Delete Board Member");
      setModalContent(
        <DeleteBoardMember
          setModalTitle={setModalTitle}
          setModalIsOpen={setIsModalOpen}
          memberToDelete={member}
        ></DeleteBoardMember>
      );
    } else {
      setModalTitle("Add Board Member");
      setModalContent(
        <CreateBoardMember
          setModalIsOpen={setIsModalOpen}
          setModalTitle={setModalTitle}
        ></CreateBoardMember>
      );
    }

    setIsModalOpen(true);
  };

  const handleSort = (column: "name" | "position") => {
    if (sortedColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedMembers = members
    ?.slice()
    .sort((a, b) => {
      const aValue = a[sortedColumn as keyof BoardMember].toLowerCase();
      const bValue = b[sortedColumn as keyof BoardMember].toLowerCase();

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    })
    .filter(
      (boardMember) =>
        boardMember.name.includes(searchOptions.name) &&
        boardMember.position.includes(searchOptions.position)
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center shadow-lg rounded-lg mb-4 p-4 bg-white">
          <label className="flex flex-col">
            <input
              name="name"
              value={searchOptions.name}
              onChange={handleSearchChange}
              placeholder="Member Name"
              required
              className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
            ></input>
            <span className="text-sm mt-1 ml-1">Name</span>
          </label>
          <label className="flex flex-col">
            <input
              name="position"
              value={searchOptions.position}
              onChange={handleSearchChange}
              placeholder="Position"
              required
              className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
            ></input>
            <span className="text-sm mt-1 ml-1">Position</span>
          </label>
          <button
            className="flex flex-col items-center bg-brand_red p-2 rounded-lg font-semibold text-sm text-white hover:bg-brand_gold hover:text-black transition-colors"
            onClick={() => handleIconClick("create")}
          >
            <Icon size="md" url="/admin/plus.svg" alt="Add Member Icon" />
            Add Member
          </button>
        </div>
        <div className="relative max-h-[60vh] overflow-y-auto shadow-lg rounded-lg">
          <table className="table-auto border-collapse text-left w-full bg-white ">
            <thead className="sticky top-0">
              <tr className="bg-brand_red">
                <th
                  onClick={() => handleSort("name")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Name{" "}
                  <span className="text-xs">
                    {sortedColumn === "name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("position")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Position{" "}
                  <span className="text-xs">
                    {sortedColumn === "position" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th className="border-b border-slate-300 p-4 text-white font-semibold">
                  Actions
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
                      <td className="p-4">
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                : sortedMembers?.map((member, idx) => (
                    <tr
                      key={member.name}
                      className={`hover:bg-gray-200 transition-colors ${
                        idx === sortedMembers.length - 1
                          ? ""
                          : "border-b border-slate-300"
                      }`}
                    >
                      <td className="p-4 flex items-center space-x-4">
                        <Image
                          src={member.image}
                          width={40}
                          height={40}
                          alt={member.name}
                          className="rounded-full shadow"
                        />
                        <h3 className="text-gray-700">{member.name}</h3>
                      </td>
                      <td className="p-4 text-gray-700">{member.position}</td>
                      <td className="p-4 space-x-4">
                        <div className="flex justify-start gap-4 items-center">
                          <Icon
                            size="sm"
                            url="/admin/edit.png"
                            alt="Edit"
                            className="cursor-pointer"
                            onClick={() => handleIconClick("edit", member)}
                          />
                          <Icon
                            size="sm"
                            url="/admin/delete.png"
                            alt="Delete"
                            className="cursor-pointer"
                            onClick={() => handleIconClick("delete", member)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}
