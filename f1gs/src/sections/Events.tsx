"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getNonCompletedEvents } from "@/lib/subapase/routes";
import { Event } from "@/lib/types";
import EventCard from "@/components/EventCard";

export default function Events() {
  const {
    data: events,
    error,
    isLoading,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: getNonCompletedEvents,
  });

  return (
    <div className="mx-auto w-[80%] text-center">
      <h1 className="text-center text-3xl font-bold py-4">Events</h1>
      <div className="grid grid-cols-5 grid-rows-5 gap-2">
        {events &&
          events.length > 0 &&
          events.map((event, index) => {
            const colSpan = index % 3 === 0 ? 2 : 1;
            const rowSpan = index % 2 === 0 ? 2 : 1;
            return (
              <div
                key={event.title}
                className={`${colSpan === 2 ? "col-span-2" : "col-span-1"} ${
                  rowSpan === 2 ? "row-span-2" : "row-span-1"
                }`}
              >
                <EventCard {...event} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
