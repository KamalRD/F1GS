import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/general/Modal";
import SignupForm from "@/components/SignupForm";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <footer className="bg-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="F1GS Logo"
              width={125}
              height={125}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cursor-pointer"
            />
          </div>
          <nav className="flex space-x-6 text-black sm:text-xl text-lg font-semibold">
            <Link href="#about" className="hover:text-brand_red transition">
              About Us
            </Link>
            <Link href="#team" className="hover:text-brand_red transition">
              Our Team
            </Link>
            <Link href="#events" className="hover:text-brand_red transition">
              Events
            </Link>
          </nav>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand_red text-white px-6 py-3 font-semibold text-xl rounded-lg hover:bg-brand_gold hover:text-black transition"
          >
            Join F1GS
          </button>
        </div>

        <hr className="border-t border-gray-800 my-8" />

        <h3 className="text-center text-black font-medium text-md">
          Sponsored By
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
          <Link href={"https://www.skadden.com/"}>
            <Image
              src="/homepage/footer/skadden.jpg"
              alt="Skadden"
              height={96}
              width={96}
              className="object-contain w-auto"
            />
          </Link>
          <Link href={"https://www.paulhastings.com/"}>
            <Image
              src="/homepage/footer/paul-hastings.png"
              alt="Paul Hastings"
              height={96}
              width={96}
              className="object-contain w-auto"
            />
          </Link>
          <Link href={"https://www.srz.com/en"}>
            <Image
              src="/homepage/footer/schulte-roth-zabel.png"
              alt="Schulte Roth + Zabel"
              height={96}
              width={96}
              className="object-contain w-auto"
            />
          </Link>
          <Link href={"https://www.ropesgray.com/en"}>
            <Image
              src="/homepage/footer/ropes-&-gray.png"
              alt="Ropes & Gray"
              height={96}
              width={96}
              className="object-contain w-auto"
            />
          </Link>
        </div>
        {/* Bottom Section */}
        <div className="mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Fordham Law FIGS. All rights reserved.
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Join F1GS"
      >
        <SignupForm />
      </Modal>
    </footer>
  );
};

export default Footer;
