import { StatusType } from "@/lib/types";
import React from "react";

export default function Status({ status }: { status: StatusType }) {
  const background: Record<StatusType, string> = {
    "In Progress": "bg-orange-100 text-orange-800",
    Upcoming: "bg-green-100 text-green-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`rounded-lg py-1 px-3 text-sm ${
        background[status] ?? "bg-gray-600 text-white"
      }`}
    >
      {status}
    </div>
  );
}

Status;
