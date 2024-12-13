import React from "react";

export default function TagChip({
  chipText,
  handleClick,
}: {
  chipText: string;
  handleClick: (option: string) => void;
}) {
  return (
    <div className="rounded-lg px-2 bg-gray-200 text-black flex justify-between items-center">
      <p className="text-xs">{chipText}</p>
      <p
        className="text-lg font-semibold"
        onClick={() => handleClick(chipText)}
      >
        &times;
      </p>
    </div>
  );
}
