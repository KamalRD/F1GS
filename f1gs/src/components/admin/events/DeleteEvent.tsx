// React & Next
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Image from "next/image";

// Components / Functions
import { deleteEvent } from "@/lib/subapase/routes";

// Types
import { BackEndEvent } from "@/lib/types";

// 3rd Party Libraries / Components
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditEvent({
  eventToDelete,
  setModalIsOpen,
  setModalTitle,
}: {
  eventToDelete: BackEndEvent;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
}) {
  const [successData, setSuccessData] = useState<BackEndEvent>();
  const eventDate = new Date(eventToDelete.start_time)
    .toLocaleDateString("en-US", {
      dateStyle: "full",
    })
    .split(", ")
    .slice(0, -1)
    .join(", ");

  const startTime = new Date(eventToDelete.start_time).toLocaleTimeString(
    "en-US",
    {
      timeStyle: "short",
    }
  );
  const endTime = new Date(eventToDelete.end_time).toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      eventId,
      eventImage,
    }: {
      eventId: string;
      eventImage: string;
    }) => deleteEvent(eventId, eventImage),
    onError() {
      setModalTitle("Something Went Wrong!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    },
    onSuccess(data) {
      setSuccessData(data);
      setModalTitle("Event Deleted!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setTimeout(() => {
        setModalIsOpen(false);
      }, 5000);
    },
  });

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    mutation.mutate({
      eventId: eventToDelete.id,
      eventImage:
        (eventToDelete.image as string).match(/\/events_images\/(.+)/)?.[1] ??
        "",
    });
  };

  return (
    <div>
      {mutation.isPending ? (
        <div className="flex justify-center items-center">
          <ClipLoader
            color="brand_black"
            speedMultiplier={1}
            size={80}
            className="mx-auto"
          />
        </div>
      ) : mutation.isError ? (
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <p>There was an error deleting this event</p>
        </div>
      ) : mutation.isSuccess ? (
        successData && (
          <div className="flex flex-col gap-y-4 justify-center items-center">
            <h1 className="text-xl text-center text-balance font-semibold">
              {successData.title}
            </h1>
            <p className="text-sm text-balance text-center">
              {eventDate} | {startTime}-{endTime} | {successData.location}
            </p>
          </div>
        )
      ) : (
        <form
          className="flex flex-col gap-4 w-[90%] mx-auto"
          onSubmit={attemptSubmit}
        >
          <div className="flex flex-col gap-y-4 py-6 justify-center items-center">
            <h1 className="text-xl text-center text-balance font-semibold">
              {eventToDelete.title}
            </h1>
            <p className="text-sm text-balance text-center">
              {eventDate} | {startTime}-{endTime} | {eventToDelete.location}
            </p>
            <Image
              className="hidden md:block"
              width={300}
              height={300}
              src={eventToDelete.image as string}
              alt={eventToDelete.title}
            />
            <p className="text-sm text-left md:max-h-[300px] overflow-auto">
              {eventToDelete.description.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < eventToDelete.description.split("\n").length - 1 && (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
          <div className="flex justify-between items-center w-[50%] mx-auto">
            <button
              className="px-6 py-3 bg-brand_red rounded-md text-white text-lg font-semibold"
              type="submit"
            >
              Delete
            </button>
            <button
              className="px-6 py-3 bg-gray-300 shadow-lg rounded-md text-black text-lg font-semibold"
              onClick={() => setModalIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
