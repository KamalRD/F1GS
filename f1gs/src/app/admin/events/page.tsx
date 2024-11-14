"use client";

// React / Next
import Image from "next/image";
import { ChangeEvent, Fragment, ReactNode, useState } from "react";

// Types
import { BackEndEvent } from "@/lib/types";

// Components / Functions
import Status from "@/components/admin/events/Status";
import Icon from "@/components/general/Icon";
import Select from "@/components/admin/events/Select";
import Modal from "@/components/general/Modal";
import { getAllEvents } from "@/lib/subapase/routes";

// 3rd Party Libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import CreateEvent from "@/components/admin/events/CreateEvent";
import EditEvent from "@/components/admin/events/EditEvent";
import DeleteEvent from "@/components/admin/events/DeleteEvent";

const searchSchema = z.object({
  title: z.string(),
  status: z.array(z.string()),
});

export default function Events() {
  const { data: events, isLoading } = useQuery<BackEndEvent[], Error>({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });

  const [searchOptions, setSearchOptions] = useState<
    z.infer<typeof searchSchema>
  >({
    title: "",
    status: [],
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);
  const [sortedColumn, setSortedColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleIconClick = (action: string, event?: BackEndEvent) => {
    if (action === "edit" && event) {
      setModalTitle("Edit Event");
      setModalContent(
        <EditEvent
          eventToEdit={event}
          setModalIsOpen={setIsModalOpen}
          setModalTitle={setModalTitle}
        ></EditEvent>
      );
    } else if (action === "delete" && event) {
      setModalTitle("Delete Event");
      setModalContent(
        <DeleteEvent
          setModalTitle={setModalTitle}
          setModalIsOpen={setIsModalOpen}
          eventToDelete={event}
        ></DeleteEvent>
      );
    } else {
      setModalTitle("Add Event");
      setModalContent(
        <CreateEvent
          setModalIsOpen={setIsModalOpen}
          setModalTitle={setModalTitle}
        ></CreateEvent>
      );
    }

    setIsModalOpen(true);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchOptions({ ...searchOptions, [name]: value });
  };

  const handleStatusChange = (statusToAlter: string) => {
    setSearchOptions((prevOptions) =>
      prevOptions.status.includes(statusToAlter)
        ? {
            ...prevOptions,
            status: prevOptions.status.filter((item) => item !== statusToAlter),
          }
        : { ...prevOptions, status: [...prevOptions.status, statusToAlter] }
    );
  };

  const handleSort = (column: "date" | "rsvp") => {
    if (sortedColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedEvents = events
    ?.slice()
    .sort((a, b) => {
      if (sortedColumn === "date") {
        const aDate = a.start_time;
        const bDate = b.start_time;

        if (aDate > bDate) {
          return sortDirection === "asc" ? -1 : 1;
        } else if (aDate < bDate) {
          return sortDirection === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      } else {
        const aValue = a[sortedColumn as keyof BackEndEvent];
        const bValue = b[sortedColumn as keyof BackEndEvent];
        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        } else if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      }
    })
    .filter((event) => {
      if (searchOptions.status.length > 0) {
        return (
          searchOptions.status.includes(event.status) &&
          event.title.includes(searchOptions.title)
        );
      }
      return event.title.includes(searchOptions.title);
    });

  return (
    <div className="w-full h-full mx-auto">
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center shadow-lg rounded-lg mb-4 p-4 bg-white">
          <label className="flex flex-col">
            <input
              name="title"
              value={searchOptions.title}
              onChange={handleSearchChange}
              placeholder="Event Title"
              required
              className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
            ></input>
            <span className="text-sm mt-1 ml-1">Title</span>
          </label>
          <label className="flex flex-col">
            <Select
              selectedOptions={searchOptions.status}
              handleChange={handleStatusChange}
            ></Select>
            <span className="text-sm mt-1 ml-1">Status</span>
          </label>
          <button
            className="flex flex-col items-center bg-brand_red p-2 rounded-lg font-semibold text-sm text-white hover:bg-brand_gold hover:text-black transition-colors"
            onClick={() => handleIconClick("create")}
          >
            <Icon size="md" url="/admin/plus.svg" alt="Add Member Icon" />
            Add Event
          </button>
        </div>
        <div className="relative max-h-[60vh] overflow-y-auto shadow-lg rounded-lg">
          <table className="table-auto border-collapse text-left w-full bg-white ">
            <thead className="sticky top-0">
              <tr className="bg-brand_red">
                <th className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer">
                  Title
                </th>
                <th className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer">
                  Description
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  Date{" "}
                  <span className="text-xs">
                    {sortedColumn === "date" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("rsvp")}
                  className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer"
                >
                  RSVP Count{" "}
                  <span className="text-xs">
                    {sortedColumn === "rsvp" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </span>
                </th>
                <th className="border-b border-slate-300 p-4 text-white font-semibold cursor-pointer">
                  Status
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
                      <td className="p-4">
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                : sortedEvents?.map((event, idx) => {
                    const eventDate = new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                      month: "short", // Shortened month (e.g., "Jan", "Feb")
                      day: "numeric",
                      year: "2-digit",
                    }).format(event.start_time);

                    const startTime = event.start_time.toLocaleTimeString(
                      "en-US",
                      {
                        timeStyle: "short",
                      }
                    );
                    const endTime = event.end_time.toLocaleTimeString("en-US", {
                      timeStyle: "short",
                    });
                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-gray-200 transition-colors ${
                          idx === sortedEvents.length - 1
                            ? ""
                            : "border-b border-slate-300"
                        }`}
                      >
                        <td className="p-4 flex flex-col items-center justify-center max-w-48">
                          <Image
                            src={event.image as string}
                            width={80}
                            height={80}
                            alt={event.title}
                            className="rounded-full shadow"
                          />
                          <h3 className="text-gray-700 text-sm text-center">
                            {event.title}
                          </h3>
                        </td>
                        <td className="p-4 text-sm text-gray-700 max-w-96">
                          <p className="line-clamp-6">
                            {event.description
                              .split("\n")
                              .map((line: string, index: number) => (
                                <Fragment key={index}>
                                  {line}
                                  {index <
                                    event.description.split("\n").length -
                                      1 && <br />}
                                </Fragment>
                              ))}
                          </p>
                        </td>
                        <td className="p-4 text-gray-700 text-center">
                          {eventDate} <br /> {startTime} - {endTime}
                        </td>
                        <td className="p-4 text-gray-700 space-x-4">0</td>
                        <td className="p-4 text-gray-700 space-x-4">
                          <Status status={event.status}></Status>
                        </td>
                        <td className="p-4 text-gray-700 space-x-4">
                          <div className="flex justify-start gap-4 items-center">
                            <Icon
                              size="sm"
                              url="/admin/edit.png"
                              alt="Edit"
                              className="cursor-pointer"
                              onClick={() => handleIconClick("edit", event)}
                            />
                            <Icon
                              size="sm"
                              url="/admin/delete.png"
                              className="cursor-pointer"
                              alt="Delete"
                              onClick={() => handleIconClick("delete", event)}
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
