import React, { useState } from "react";

import { FrontEndEvent } from "@/lib/types";
import Button from "../general/Button";
import Modal from "../general/Modal";
import EventModal from "./EventModal";

function EventCard(event: FrontEndEvent) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const eventDate = event.start_time
    .toLocaleDateString("en-US", {
      dateStyle: "full",
    })
    .split(", ")
    .slice(0, -1)
    .join(", ");

  const startTime = event.start_time.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });
  const endTime = event.end_time.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return (
    <>
      <div
        className="relative flex flex-col md:h-96 md:w-96 w-[300px] h-[300px] rounded-xl bg-white border-2 border-[rgb(210, 210, 210, .5)] shadow-carousel overflow-hidden cursor-pointer mx-auto"
        onClick={() => setModalIsOpen(true)}
      >
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-300"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 py-4 px-2 h-full bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-y-4 h-full justify-between items-center w-[90%] mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-balance">{event.title}</h1>
              <p className="text-sm text-balance">
                {eventDate} | {startTime}-{endTime} | {event.location}
              </p>
            </div>
            <div className="relative group cursor-pointer">
              <p className="text-sm text-left line-clamp-3 md:line-clamp-6">
                {event.description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < event.description.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
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
            <div className="absolute right-0 bottom-0 h-16 w-16">
              <div className="absolute transform -rotate-45 bg-brand_gold text-center text-xs text-black font-semibold py-1 right-[-34px] bottom-[32px] w-[170px]">
                Click to Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        title={event.title}
        onClose={() => setModalIsOpen(false)}
      >
        <EventModal {...event}></EventModal>
      </Modal>
    </>
  );
}

export default EventCard;
