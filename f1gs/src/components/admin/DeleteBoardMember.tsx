// React & Next
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import Image from "next/image";

// Components / Functions
import { deleteBoardMember } from "@/lib/subapase/routes";

// Types

// 3rd Party Libraries / Components
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardMemberValues } from "./EditBoardForm";

export default function DeleteBoardMember({
  memberToDelete,
  setModalIsOpen,
  setModalTitle,
}: {
  memberToDelete: BoardMemberValues;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      memberId,
      memberImage,
    }: {
      memberId: string;
      memberImage: string;
    }) => deleteBoardMember(memberId, memberImage),
    onError() {
      setModalTitle("Something Went Wrong!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["boardMembers"] });
      if (data) {
        setModalTitle("Board Member Deleted");
        setTimeout(() => {
          setModalIsOpen(false);
        }, 2000);
      }
    },
  });

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    mutation.mutate({
      memberId: memberToDelete.id,
      memberImage:
        memberToDelete.image.match(/\/board_member_images\/(.+)/)?.[1] ?? "",
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
          <p>There was an error deleting a new board member</p>
        </div>
      ) : mutation.isSuccess ? (
        <div className="flex flex-col gap-y-4 justify-center items-center">
          <div className="flex gap-x-4 items-center">
            <Image
              width={80}
              height={80}
              className="object-cover rounded-full shadow-md"
              src={memberToDelete.image}
              alt={`${memberToDelete?.first_name} ${memberToDelete?.last_name} Profile Image`}
            />
            <div className="flex flex-col gap-y-2">
              <p>
                <span className="font-semibold">Name: </span>
                {memberToDelete?.first_name} {memberToDelete?.last_name}
              </p>
              <p>
                <span className="font-semibold">Position: </span>
                {memberToDelete?.position}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col w-[90%] mx-auto"
          onSubmit={attemptSubmit}
        >
          <div className="flex flex-col gap-y-4 py-6 justify-center items-center">
            <div className="flex gap-x-4 items-center">
              <Image
                width={80}
                height={80}
                className="object-cover rounded-full shadow-md"
                src={memberToDelete.image}
                alt={`${memberToDelete?.first_name} ${memberToDelete?.last_name} Profile Image`}
              />
              <div className="flex flex-col gap-y-2">
                <p>
                  <span className="font-semibold">Name: </span>
                  {memberToDelete?.first_name} {memberToDelete?.last_name}
                </p>
                <p>
                  <span className="font-semibold">Position: </span>
                  {memberToDelete?.position}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-[50%] mx-auto">
            <button className="px-6 py-3 bg-brand_red rounded-md text-white text-lg font-semibold">
              Delete
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
