"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import Button from "../components/general/Button";
import Modal from "../components/general/Modal";
import Form from "../components/Form";

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div
      className="relative w-full md:h-screen h-[90vh] flex flex-col sm:gap-8 gap-4 items-center justify-center
      md:bg-[url('/homepage/desktop-bg.png')]
      bg-[url('/homepage/mobile-bg.png')] bg-no-repeat bg-cover"
    >
      {/* Text */}
      <motion.h1
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 1,
          },
        }}
        initial={{ y: -10, opacity: 0 }}
        className="text-center text-brand_black text-3xl sm:text-4xl md:text-6xl  md:m-0 pb-4 font-bold w-[90%]"
      >
        Fordham Law
        <br />
        First Generation Students
      </motion.h1>
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
          <Form />
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
          <Form />
        </Modal>
      </div>
    </div>
  );
}
