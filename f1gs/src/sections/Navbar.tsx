"use client";

// Default Components / React
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Components
import { Twirl as Hamburger } from "hamburger-react";
import Link from "next/link";
import Icon from "@/components/general/Icon";

export default function Navbar({ activeSection }: { activeSection: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const flyoutVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <div
      className="
        lg:grid lg:grid-cols-[30%_1fr_10%] lg:p-4
        align-middle sticky gap-8 px-4 pt-4 pb-2 bg-[#f1f5f9] rounded-sm shadow-md
        flex justify-between z-[99] top-0 items-center"
    >
      <Link href={"/"}>
        <Image
          src={"/logo.png"}
          width={80}
          height={80}
          alt="F1GS Logo"
          priority
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:grid grid-cols-4">
        <Link
          href={"/#about"}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-xl font-semibold">About Us</h1>
          <motion.span
            className={`inline-block rounded-full w-2 h-2 bg-brand_black`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === "about" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        <Link
          href={"/#team"}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-xl font-semibold">Our Team</h1>
          <motion.span
            className={`inline-block rounded-full w-2 h-2 bg-brand_black`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === "team" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        <Link
          href={"/#events"}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-xl font-semibold">Events</h1>
          <motion.span
            className={`inline-block rounded-full w-2 h-2 bg-brand_black`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === "events" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        <Link
          href={"/#join"}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-xl font-semibold">Join F1GS</h1>
          <motion.span
            className={`inline-block rounded-full w-2 h-2 bg-brand_black`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSection === "join" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </div>
      <Link
        href={"/login"}
        className="hidden lg:flex items-center justify-center"
      >
        <Icon size="lg" url="/profile.png" alt="Login"></Icon>
      </Link>

      {/* Mobile Navigation */}
      <div className="lg:hidden overflow-x-hidden ">
        <Hamburger
          toggled={mobileMenuOpen}
          toggle={setMobileMenuOpen}
          color="var(--black)"
        />
        {/* Flyout Menu with Framer Motion */}
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-slate-100 p-4 z-[9999]"
          initial="hidden"
          animate={mobileMenuOpen ? "visible" : "hidden"}
          exit="exit"
          variants={flyoutVariants}
        >
          <div className="flex justify-between items-center">
            <Image
              src={"/logo.png"}
              width={80}
              height={80}
              alt="F1GS Logo"
              priority
            />
            <Hamburger
              toggled={mobileMenuOpen}
              toggle={setMobileMenuOpen}
              color="var(--black)"
            />
          </div>

          {/* Menu Items */}
          <div className="flex flex-col h-[85%] justify-between mx-auto mt-6">
            <div className="flex flex-col gap-y-6">
              <Link
                href={"/#about"}
                className="flex flex-col items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <h1 className="text-xl font-semibold">About Us</h1>
              </Link>
              <Link
                href={"/#team"}
                className="flex flex-col items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <h1 className="text-xl font-semibold">Our Team</h1>
              </Link>
              <Link
                href={"/#events"}
                className="flex flex-col items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <h1 className="text-xl font-semibold">Events</h1>
              </Link>
              <Link
                href={"/#join"}
                className="flex flex-col items-center justify-center"
              >
                <h1 className="text-xl font-semibold">Join F1GS</h1>
              </Link>
            </div>
            <Link
              href={"/login"}
              className="flex items-center justify-center gap-x-2"
            >
              <Icon size="lg" url="/profile.png" alt="Login"></Icon>
              <h1 className="text-xl font-semibold">Login</h1>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
