"use client";
import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import Icon from "./general/Icon";
import Link from "next/link";

type CardProps = {
  name: string;
  title: string;
  image: string;
  linkedin: string;
  isHovered: boolean;
  hoveredMember: string;
  setHoveredMember: React.Dispatch<React.SetStateAction<string>>;
};

function BoardCard({
  name,
  title,
  image,
  linkedin,
  isHovered,
  hoveredMember,
  setHoveredMember,
}: CardProps) {
  return (
    <motion.div
      className={`flex flex-col justify-start items-center rounded-xl border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-44 h-60 px-2 py-4 transition`}
      whileHover={{
        scale: 1.075,
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
          delay: 0.5,
        },
      }}
      viewport={{ once: true }}
      onHoverStart={() => setHoveredMember(name)}
      onHoverEnd={() => setHoveredMember("")}
      style={{
        opacity: !hoveredMember || isHovered ? 1 : 0.25,
      }}
    >
      <Link href={linkedin} target="_blank">
        <Image
          className="rounded-full w-24 h-24 border-2 border-solid border-brand_red object-cover"
          width={100}
          height={100}
          src={image}
          alt={`${name} - ${title}`}
        />
      </Link>
      <div className="flex flex-col mt-3">
        <h1 className="text-lg font-semibold">{name}</h1>
        <h3>{title}</h3>
      </div>
    </motion.div>
  );
}

export default BoardCard;
