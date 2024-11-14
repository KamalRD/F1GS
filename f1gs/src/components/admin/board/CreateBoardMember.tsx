// React & Next
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Image from "next/image";

// Components / Functions
import { getImage, insertBoardMember } from "@/lib/subapase/routes";
import Button from "../../general/Button";

// Types
import { BoardMember } from "@/lib/types";

// 3rd Party Libraries / Components
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Zod Schema
const boardMemberSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(1, { message: "Last Name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  image: z.any().refine((file) => file !== null, {
    message: "Image is required",
  }),
  linkedin: z
    .string()
    .min(1, { message: "LinkedIn is required" })
    .startsWith("https://www.linkedin.com/in/", {
      message: "Enter a valid LinkedIn URL",
    }),
});

export type CreateBoardMemberValues = z.infer<typeof boardMemberSchema>;

export default function CreateBoardMember({
  setModalIsOpen,
  setModalTitle,
}: {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
}) {
  const [memberValues, setMemberValues] = useState<CreateBoardMemberValues>({
    first_name: "",
    last_name: "",
    position: "",
    image: null,
    linkedin: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateBoardMemberValues, string>>
  >({});
  const [successData, setSuccessData] = useState<Partial<BoardMember>>();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      newMemberDetails,
    }: {
      newMemberDetails: CreateBoardMemberValues;
    }) => insertBoardMember(newMemberDetails),
    onError() {
      setModalTitle("Something Went Wrong!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["boardMembers"] });
      if (data) {
        setSuccessData(data[0]);
        setModalTitle("Success!");
        setTimeout(() => {
          setModalIsOpen(false);
        }, 2000);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof CreateBoardMemberValues];
      return newErrors;
    });
    setMemberValues({ ...memberValues, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setMemberValues({ ...memberValues, image: file });
      setImagePreview(imageUrl);
    }
  };

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const result = boardMemberSchema.safeParse(memberValues);

    if (!result.success) {
      const validationErrors: Partial<
        Record<keyof CreateBoardMemberValues, string>
      > = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0] in memberValues) {
          validationErrors[err.path[0] as keyof CreateBoardMemberValues] =
            err.message;
        }
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Trigger your mutation here
      mutation.mutate({ newMemberDetails: memberValues });
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
      ) : mutation.isSuccess ? (
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <h1 className="text-lg">New Member Details:</h1>
          <div className="flex gap-x-4 items-center">
            {successData?.image ? (
              <Image
                width={80}
                height={80}
                className="object-cover rounded-full shadow-md"
                src={getImage("board_member_images", successData.image)}
                alt={`${successData?.first_name} ${successData?.last_name} Profile Image`}
              />
            ) : (
              ""
            )}
            <div className="flex flex-col gap-y-2">
              <p>
                <span className="font-semibold">Name: </span>
                {successData?.first_name} {successData?.last_name}
              </p>
              <p>
                <span className="font-semibold">Position: </span>
                {successData?.position}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col md:grid md:grid-cols-2 gap-4 w-[90%] mx-auto"
          onSubmit={attemptSubmit}
        >
          <fieldset className="flex flex-col gap-2">
            <h2 className="text-md font-semibold">Name</h2>
            <label className="flex flex-col w-[90%]">
              <input
                name="first_name"
                value={memberValues.first_name}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.first_name ? "border-red-500" : ""
                }`}
              />
              <span className="text-xs text-red-500">{errors.first_name}</span>
              <span className="text-sm">First Name</span>
            </label>
            <label className="flex flex-col w-[90%]">
              <input
                name="last_name"
                value={memberValues.last_name}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.last_name ? "border-red-500" : ""
                }`}
              />
              <span className="text-xs text-red-500">{errors.last_name}</span>
              <span className="text-sm">Last Name</span>
            </label>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <h2 className="text-md font-semibold">Board Position</h2>
            <label className="row-start-2 col-span-1 flex flex-col w-[90%]">
              <input
                name="position"
                value={memberValues.position}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.position ? "border-red-500" : ""
                }`}
              />
              <span className="text-xs text-red-500">{errors.position}</span>
              <span className="text-sm">Position</span>
            </label>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <h2 className="text-md font-semibold">LinkedIn URL</h2>
            <label className="flex flex-col w-[90%]">
              <input
                name="linkedin"
                placeholder="https://linkedin.com/in/..."
                value={memberValues.linkedin}
                onChange={handleInputChange}
                className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
                  errors.position ? "border-red-500" : ""
                }`}
              />
              <span className="text-xs text-red-500">{errors.linkedin}</span>
              <span className="text-sm">LinkedIn</span>
            </label>
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
          <div className="flex justify-between items-center w-[50%] col-span-2 mx-auto">
            <button
              className="px-6 py-3 bg-brand_red rounded-md text-white text-lg font-semibold"
              type="submit"
            >
              Create
            </button>
            <button className="px-6 py-3 bg-gray-300 shadow-lg rounded-md text-black text-lg font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
