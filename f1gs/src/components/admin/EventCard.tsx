import React, { useState } from "react";

import { FrontEndEvent } from "@/lib/types";
import Modal from "../general/Modal";
import EventModal from "../events/EventModal";

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
        className="relative flex flex-col h-64 w-64 rounded-xl bg-white border-2 border-[rgb(210, 210, 210, .5)] shadow-carousel overflow-hidden mx-auto"
        onClick={() => setModalIsOpen(true)}
      >
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-300"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 py-4 px-2 h-full bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-y-4 h-full justify-between items-center w-[90%] mx-auto">
            <div>
              <h1 className="text-lg font-bold text-balance">{event.title}</h1>
              <p className="text-sm text-balance">
                {eventDate} | {startTime}-{endTime} | {event.location}
              </p>
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
