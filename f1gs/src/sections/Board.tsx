"use client";
import React, { useState } from "react";

import Card from "@/components/Card";

import BoardMembers from "@/data/board.json";

export default function Board() {
  const [hoveredMember, setHoveredMember] = useState<string>("");

  return (
    <div className="mx-auto text-center">
      <h1 className="text-center text-3xl font-bold py-4">Our Team</h1>

      <div className="flex flex-row justify-center flex-wrap gap-4 max-w-[900px] mx-auto w-[90%] md:w-[80%] py-4">
        {BoardMembers.map((member) => (
          <Card
            key={member.name}
            name={member.name}
            title={member.title}
            image={member.image}
            isHovered={hoveredMember === member.name}
            hoveredMember={hoveredMember}
            setHoveredMember={setHoveredMember}
          ></Card>
        ))}
      </div>
    </div>
  );
}
