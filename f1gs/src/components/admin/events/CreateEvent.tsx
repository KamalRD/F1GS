// React & Next
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Image from "next/image";

// Components / Functions
import { insertEvent } from "@/lib/subapase/routes";

// Types

// 3rd Party Libraries / Components
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { FrontEndEvent } from "@/lib/types";
import EventModal from "@/components/events/EventModal";

// Zod Schema
const eventSchema = z.object({
  title: z.string().min(1, { message: "A title is required" }),
  description: z.string().min(1, { message: "A description is required" }),
  start_time: z.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
  end_time: z.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
  image: z.any().refine((file) => file !== null, {
    message: "An image is required",
  }),
  location: z.string().min(1, { message: "A location is required" }),
  rsvp: z.string().min(1, { message: "An RSVP link is required" }),
});

export type CreateEventValues = z.infer<typeof eventSchema>;

const formatToEST = (date: Date) => {
  // Options to format date to EST with the desired components
  // const options = {
  //   timeZone: "America/New_York",
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false, // 24-hour format
  // };

  // Get the formatted parts
  const [month, day, year, hour, minute] = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  })
    .formatToParts(date)
    .filter((part) =>
      ["month", "day", "year", "hour", "minute"].includes(part.type)
    )
    .map((part) => part.value);

  // Construct the formatted string as yyyy-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export default function CreateEvent({
  setModalIsOpen,
  setModalTitle,
}: {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
}) {
  const [eventValues, setEventValues] = useState<CreateEventValues>({
    title: "",
    description: "",
    start_time: formatToEST(new Date()),
    end_time: formatToEST(new Date()),
    image: null,
    location: "",
    rsvp: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>();
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateEventValues, string>>
  >({});
  const [successData, setSuccessData] = useState<FrontEndEvent>();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ newEventDetails }: { newEventDetails: CreateEventValues }) =>
      insertEvent(newEventDetails),
    onError() {
      setModalTitle("Something Went Wrong!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (data) {
        setSuccessData(data[0]);
        setModalTitle("Success!");
        setTimeout(() => {
          setModalIsOpen(false);
        }, 5000);
      }
    },
  });

  const updateFormErrors = (fieldName: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldName as keyof CreateEventValues];
      return newErrors;
    });
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormErrors(name);
    setEventValues({ ...eventValues, [name]: value });
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormErrors(name);
    setEventValues({ ...eventValues, [name]: formatToEST(new Date(value)) });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEventValues({ ...eventValues, image: file });
      setImagePreview(imageUrl);
    }
  };

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const result = eventSchema.safeParse(eventValues);

    if (!result.success) {
      const validationErrors: Partial<Record<keyof CreateEventValues, string>> =
        {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0] in eventValues) {
          validationErrors[err.path[0] as keyof CreateEventValues] =
            err.message;
        }
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      mutation.mutate({ newEventDetails: eventValues });
    }
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
          <p>There was an error creating a new board member</p>
        </div>
      ) : mutation.isSuccess && successData ? (
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <h1 className="text-lg">New Event Details:</h1>
          <EventModal {...successData}></EventModal>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4 w-[90%] mx-auto"
          onSubmit={attemptSubmit}
        >
          <fieldset className="flex flex-col gap-4">
            <h2 className="text-md font-semibold">Overview</h2>
            <div className="flex justify-between items-center">
              <label className="flex flex-col w-[45%]">
                <input
                  name="title"
                  value={eventValues.title}
                  onChange={handleInputChange}
                  className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-red-500">{errors.title}</span>
                <span className="text-sm">Title</span>
              </label>
              <label className="flex flex-col w-[45%]">
                <input
                  name="location"
                  value={eventValues.location}
                  onChange={handleInputChange}
                  className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                    errors.location ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-red-500">{errors.location}</span>
                <span className="text-sm">Location</span>
              </label>
            </div>
            <label className="flex flex-col">
              <textarea
                rows={4}
                name="description"
                value={eventValues.description}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.description ? "border-red-500" : ""
                }`}
              ></textarea>
              <span className="text-xs text-red-500">{errors.description}</span>
              <span className="text-sm">Description</span>
            </label>
            <label className="flex flex-col w-[90%]">
              <input
                name="rsvp"
                value={eventValues.rsvp}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.rsvp ? "border-red-500" : ""
                }`}
              />
              <span className="text-xs text-red-500">{errors.rsvp}</span>
              <span className="text-sm">RSVP</span>
            </label>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <h2 className="text-md font-semibold">Date & Time</h2>
            <div className="flex justify-between items-center">
              <label className="flex flex-col w-[45%]">
                <input
                  type="datetime-local"
                  name="start_time"
                  min={formatToEST(new Date())}
                  value={eventValues.start_time}
                  onChange={handleDateTimeChange}
                  className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                    errors.start_time ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-red-500">
                  {errors.start_time}
                </span>
                <span className="text-sm">Start Time</span>
              </label>
              <label className="flex flex-col w-[45%]">
                <input
                  type="datetime-local"
                  name="end_time"
                  value={eventValues.end_time}
                  min={formatToEST(new Date())}
                  onChange={handleDateTimeChange}
                  className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                    errors.end_time ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-red-500">{errors.end_time}</span>
                <span className="text-sm">End Time</span>
              </label>
            </div>
          </fieldset>
          <fieldset className="col-span-2 flex flex-col gap-2">
            <h2 className="text-md font-semibold">Image</h2>
            <div className="flex flex-row items-center gap-x-4">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={80}
                  height={80}
                  className="object-cover rounded-full shadow-md"
                />
              )}
              <label className="flex flex-col w-[50%]">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                    errors.image ? "border-red-500" : ""
                  }`}
                />
                <span className="text-xs text-red-500">{errors.image}</span>
              </label>
            </div>
          </fieldset>
          <div className="flex justify-between items-center w-[50%] mx-auto">
            <button
              className="px-6 py-3 bg-brand_red rounded-md text-white text-lg font-semibold"
              type="submit"
            >
              Create
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
