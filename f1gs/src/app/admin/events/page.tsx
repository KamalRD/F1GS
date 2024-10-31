"use client";

import Image from "next/image";
import { getAllEvents } from "@/lib/subapase/routes";
import { Event } from "@/lib/types";
// 3rd Partys
import { useQuery } from "@tanstack/react-query";
import Icon from "@/components/general/Icon";

export default function Events() {
  const {
    data: events,
    error,
    isLoading,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <div className="relative max-h-[60vh] overflow-y-auto shadow-lg rounded-lg">
          <table className="table-auto border-collapse text-left w-full bg-white ">
            <thead className="sticky top-0">
              <tr className="bg-brand_red">
                <th
                  // onClick={() => handleSort("name")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Title{" "}
                  {/* <span className="text-xs">
                    {sortedColumn === "name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span> */}
                </th>
                <th
                  // onClick={() => handleSort("position")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer max-w-64 truncate"
                >
                  Description{" "}
                  {/* <span className="text-xs">
                    {sortedColumn === "position" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span> */}
                </th>
                <th
                  // onClick={() => handleSort("position")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Date{" "}
                  {/* <span className="text-xs">
                    {sortedColumn === "position" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span> */}
                </th>
                <th
                  // onClick={() => handleSort("position")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  RSVP Count{" "}
                  {/* <span className="text-xs">
                    {sortedColumn === "position" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span> */}
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
                : events?.map((event, idx) => {
                    const eventDate = event.startTime
                      .toLocaleDateString("en-US", {
                        dateStyle: "full",
                      })
                      .split(", ")
                      .slice(0, -1)
                      .join(", ");

                    const startTime = event.startTime.toLocaleTimeString(
                      "en-US",
                      {
                        timeStyle: "short",
                      }
                    );
                    const endTime = event.endTime.toLocaleTimeString("en-US", {
                      timeStyle: "short",
                    });
                    return (
                      <tr
                        key={idx}
                        // className={`hover:bg-gray-200 transition-colors ${
                        //   idx === sortedMembers.length - 1
                        //     ? ""
                        //     : "border-b border-slate-300"
                        // }`}
                      >
                        <td className="p-4 flex items-center space-x-4 max-w-48">
                          <Image
                            src={event.image}
                            width={40}
                            height={40}
                            alt={event.title}
                            className="rounded-full shadow"
                          />
                          <h3 className="text-gray-700">{event.title}</h3>
                        </td>
                        <td className="p-4 text-gray-700 max-w-72">
                          {event.description}
                        </td>
                        <td className="p-4 text-gray-700">
                          {eventDate} <br /> {startTime} - {endTime}
                        </td>
                        <td className="p-4 space-x-4">0</td>
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
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal> */}
    </div>
  );
}
