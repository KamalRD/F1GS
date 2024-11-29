import React from "react";

export default function TagChip({ chipText }: { chipText: string }) {
  return (
    <div className="rounded-lg px-2 py-1 w-fit bg-brand_red text-white flex justify-between items-center">
      <p className="text-sm">{chipText}</p>
    </div>
  );
}
