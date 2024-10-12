"use client";
import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";

type CardProps = {
  name: string;
  title: string;
  image: string;
  isHovered: boolean;
  hoveredMember: string;
  setHoveredMember: React.Dispatch<React.SetStateAction<string>>;
};

function Card({
  name,
  title,
  image,
  isHovered,
  hoveredMember,
  setHoveredMember,
}: CardProps) {
  return (
    <motion.div
      className={`flex flex-col justify-start items-center rounded-xl border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-44 h-60 px-2 py-4 transition ${
        !hoveredMember || isHovered ? "opacity-100" : "opacity-25"
      }`}
      whileHover={{
        scale: 1.05,
        translateY: -10,
        transition: {
          duration: 0.1,
        },
      }}
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 1,
        },
      }}
      viewport={{ once: true }}
      onHoverStart={() => setHoveredMember(name)}
      onHoverEnd={() => setHoveredMember("")}
    >
      <Image
        className="rounded-full w-24 h-24 border-2 border-solid border-brand_red object-cover"
        width={100}
        height={100}
        src={image}
        alt={`${name} - ${title}`}
      />
      <div className="flex flex-col mt-3">
        <h1 className="text-lg font-semibold">{name}</h1>
        <h3>{title}</h3>
      </div>
    </motion.div>
  );
}

export default Card;
