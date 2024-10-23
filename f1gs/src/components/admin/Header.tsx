import React from "react";

function Header({ componentTitle }: { componentTitle: string }) {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-bold">{componentTitle}</h1>
    </div>
  );
}

export default Header;
