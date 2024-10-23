"use client";
import React, { useState } from "react";

import Card from "@/components/Card";

import { useQuery } from "@tanstack/react-query";
import { BoardMember } from "@/lib/types";
import { getBoardMembers } from "@/lib/subapase/routes";

export default function Board() {
  const [hoveredMember, setHoveredMember] = useState<string>("");

  const {
    data: boardMembers,
    error,
    isLoading,
  } = useQuery<BoardMember[], Error>({
    queryKey: ["boardMembers"],
    queryFn: getBoardMembers,
  });

  return (
    <div className="mx-auto text-center">
      <h1 className="text-center text-3xl font-bold py-4">Our Team</h1>

      <div className="flex flex-row justify-center flex-wrap gap-4 max-w-[900px] mx-auto w-[90%] md:w-[80%] py-4">
        {boardMembers?.map((member) => (
          <Card
            key={member.name}
            name={member.name}
            title={member.position}
            image={member.image}
            linkedin={member.linkedin}
            isHovered={hoveredMember === member.name}
            hoveredMember={hoveredMember}
            setHoveredMember={setHoveredMember}
          ></Card>
        ))}
      </div>
    </div>
  );
}
