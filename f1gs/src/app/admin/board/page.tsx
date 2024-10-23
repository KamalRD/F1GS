"use client";

// React & Next
import Image from "next/image";
import { ReactNode, useState } from "react";

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

export default function Board() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);

  const [sortedColumn, setSortedColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const {
    data: members,
    error,
    isLoading,
  } = useQuery<BoardMember[], Error>({
    queryKey: ["boardMembers"],
    queryFn: getBoardMembers,
  });

  const handleIconClick = (action: string, member: BoardMember) => {
    if (action === "edit") {
      setModalTitle("Edit Board Member");
      setModalContent(
        <EditBoardForm
          memberToEdit={member}
          setModalIsOpen={setIsModalOpen}
          setModalTitle={setModalTitle}
        ></EditBoardForm>
      );
    } else {
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

  const sortedMembers = members?.slice().sort((a, b) => {
    const aValue = a[sortedColumn as keyof BoardMember].toLowerCase();
    const bValue = b[sortedColumn as keyof BoardMember].toLowerCase();

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
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
