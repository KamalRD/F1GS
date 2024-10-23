import Navbar from "@/sections/Navbar";
import React from "react";

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar activeSection=""></Navbar>
      {children}
    </div>
  );
}
