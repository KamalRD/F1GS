"use client";
import React from "react";
import { motion } from "framer-motion";

function BoardLoadingCard() {
  return (
    <motion.div
      className={`flex flex-col justify-start items-center rounded-xl bg-white animate-pulse border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-44 h-60 px-2 py-4 transition`}
    >
      <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full"></div>
      <div className="flex flex-col mt-3 gap-y-4">
        <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-200 animate-pulse"></div>
      </div>
    </motion.div>
  );
}

export default BoardLoadingCard;
