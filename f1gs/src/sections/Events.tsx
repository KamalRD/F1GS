"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getNonCompletedEvents } from "@/lib/subapase/routes";
import { FrontEndEvent } from "@/lib/types";
import EventCard from "@/components/events/EventCard";

export default function Events() {
  const {
    data: events,
    // TO DO
    // error,
    // isLoading,
  } = useQuery<FrontEndEvent[], Error>({
    queryKey: ["events"],
    queryFn: getNonCompletedEvents,
  });

  return (
    <div className="mx-auto lg:w-[80%] w-full py-8 text-center">
      <h1 className="text-center text-3xl font-bold py-4">Events</h1>
      <div
        className={`flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-auto justify-center items-center gap-2`}
      >
        {events &&
          events.length > 0 &&
          events.map((event) => {
            return <EventCard key={event.title} {...event} />;
          })}
      </div>
    </div>
  );
}
