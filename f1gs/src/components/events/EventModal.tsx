import React from "react";

import Image from "next/image";

import { FrontEndEvent } from "@/lib/types";
import Button from "../general/Button";

function EventModal(event: FrontEndEvent) {
  const eventDate = new Date(event.start_time)
    .toLocaleDateString("en-US", {
      dateStyle: "full",
    })
    .split(", ")
    .slice(0, -1)
    .join(", ");

  const startTime = new Date(event.start_time).toLocaleTimeString("en-US", {
    timeStyle: "short",
  });
  const endTime = new Date(event.end_time).toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col justify-center items-center md:w-[90%] mx-auto gap-y-4">
      <p className="text-sm text-balance text-center">
        {eventDate} | {startTime}-{endTime} | {event.location}
      </p>
      <Image
        className="hidden md:block"
        width={300}
        height={300}
        src={event.image}
        alt={event.title}
      />
      <p className="text-sm text-left md:max-h-[300px] overflow-auto">
        {event.description.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < event.description.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="flex justify-center items-center">
        <Button
          size="small"
          color="secondary"
          hoverColor="primary"
          onClick={() => window.open(event.rsvp)}
        >
          RSVP
        </Button>
      </div>
    </div>
  );
}

export default EventModal;
