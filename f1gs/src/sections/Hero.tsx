"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import Button from "../components/general/Button";
import Modal from "../components/general/Modal";
import SignupForm from "../components/SignupForm";

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div
      className="relative w-full md:h-screen h-[90vh] flex flex-col sm:gap-8 gap-4 items-center justify-center
      md:bg-[url('/homepage/hero/desktop-bg.png')]
      bg-[url('/homepage/hero/mobile-bg.png')] bg-no-repeat bg-cover"
    >
      {/* Text */}
      <motion.div
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 1,
          },
        }}
        initial={{ y: -10, opacity: 0 }}
        className="text-center md:m-0 pb-4 w-[90%]"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand_black">
          Fordham Law
          <br />
          First Generation Students
        </h1>
        <h3 className="md:w-[60%] mx-auto text-base md:text-xl font-medium mt-4 text-balance">
          Empowering first-generation law students at Fordham University to
          excel, connect, and lead in the legal profession
        </h3>
      </motion.div>
      <div className="mt-8 hidden md:block">
        <Button
          size="large"
          color="primary"
          hoverColor="secondary"
          onClick={() => setModalOpen(true)}
        >
          Join F1GS
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Join F1GS"
        >
          <SignupForm />
        </Modal>
      </div>
      <div className="my-4 md:hidden block">
        <Button
          size="small"
          color="primary"
          hoverColor="secondary"
          onClick={() => setModalOpen(true)}
        >
          Join F1GS
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Join F1GS"
        >
          <SignupForm />
        </Modal>
      </div>
    </div>
  );
}
