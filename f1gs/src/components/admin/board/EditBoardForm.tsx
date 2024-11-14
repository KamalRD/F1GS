// React & Next
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Image from "next/image";

// Components / Functions
import { updateMemberDetails, getImage } from "@/lib/subapase/routes";
import Button from "../../general/Button";

// Types
import { BoardMember } from "@/lib/types";

// 3rd Party Libraries / Components
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Zod Schema
const boardMemberSchema = z.object({
  first_name: z.string().min(0, { message: "First Name is required" }),
  last_name: z.string().min(0, { message: "Last Name is required" }),
  position: z.string().min(0, { message: "Position is required" }),
  image: z.any(),
  linkedin: z
    .string()
    .min(0, { message: "LinkedIn is required" })
    .startsWith("https://www.linkedin.com/in/", {
      message: "Enter a valid LinkedIn URL",
    }),
});

export type BoardMemberValues = z.infer<typeof boardMemberSchema> & {
  id: string;
};

export default function EditBoardForm({
  memberToEdit,
  setModalIsOpen,
  setModalTitle,
}: {
  memberToEdit: BoardMember;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
}) {
  const [memberValues, setMemberValues] = useState<BoardMemberValues>({
    first_name: memberToEdit.first_name,
    last_name: memberToEdit.last_name,
    position: memberToEdit.position,
    id: memberToEdit.id,
    image: memberToEdit.image,
    linkedin: memberToEdit.linkedin,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    memberToEdit.image
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof BoardMemberValues, string>>
  >({});
  const [successData, setSuccessData] = useState<Partial<BoardMember>>();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      newMemberDetails,
      oldImageName,
    }: {
      id: string;
      newMemberDetails: Partial<BoardMember>;
      oldImageName: string;
    }) => updateMemberDetails(id, newMemberDetails, oldImageName),
    onError() {
      setModalTitle("Something Went Wrong!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["boardMembers"] });
      setSuccessData(data[0]);
      setModalTitle("Success!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 2000);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof BoardMemberValues];
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

  const calculateDiff = (
    currentValues: BoardMemberValues,
    originalValues: BoardMember
  ) => {
    const diff: Partial<BoardMemberValues> = {};

    if (currentValues.first_name !== originalValues.first_name) {
      diff.first_name = currentValues.first_name;
    }
    if (currentValues.last_name !== originalValues.last_name) {
      diff.last_name = currentValues.last_name;
    }
    if (currentValues.position !== originalValues.position) {
      diff.position = currentValues.position;
    }
    if (currentValues.image !== originalValues.image) {
      diff.image = currentValues.image; // This can be the new file if image is changed
    }

    return diff;
  };

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const result = boardMemberSchema.safeParse(memberValues);

    if (!result.success) {
      const validationErrors: Partial<Record<keyof BoardMemberValues, string>> =
        {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0] in memberValues) {
          validationErrors[err.path[0] as keyof BoardMemberValues] =
            err.message;
        }
      });
      setErrors(validationErrors);
    } else {
      const changedFields = calculateDiff(memberValues, memberToEdit);

      if (Object.keys(changedFields).length === 0) {
        setTimeout(() => setModalIsOpen(false), 500);
        console.log("No changes detected, nothing to submit.");
      } else {
        mutation.mutate({
          id: memberToEdit.id,
          newMemberDetails: changedFields,
          oldImageName:
            memberToEdit.image.match(/\/board_member_images\/(.+)/)?.[1] ?? "",
        });
      }
      setErrors({});
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
          <p>There was an error updating the board member</p>
        </div>
      ) : mutation.isSuccess ? (
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <h1 className="text-lg">Board Member Details:</h1>
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
          <div className="mx-auto col-span-2">
            <Button
              type="submit"
              size="xsmall"
              color="primary"
              hoverColor="secondary"
            >
              Confirm Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
