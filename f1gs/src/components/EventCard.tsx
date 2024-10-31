import React from "react";

import { Event } from "@/lib/types";
import Button from "./general/Button";

function EventCard(event: Event) {
  const eventDate = event.startTime
    .toLocaleDateString("en-US", {
      dateStyle: "full",
    })
    .split(", ")
    .slice(0, -1)
    .join(", ");

  const startTime = event.startTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });
  const endTime = event.endTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return (
    <div className="relative flex flex-col h-96 rounded-xl border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel overflow-hidden">
      <div
        className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-300"
        style={{ backgroundImage: `url(${event.image})` }}
      />
      {/* Overlay for text on hover */}
      <div className="absolute inset-0 p-4 bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-y-4 justify-start w-[90%] mx-auto">
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-sm">
              {eventDate} | {startTime}-{endTime} | {event.location}
            </p>
          </div>
          <p className="text-sm text-left overflow-x-auto">
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
      </div>
    </div>
  );
}

export default EventCard;
