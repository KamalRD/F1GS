'use client';

import { useState } from "react";

import { motion } from "framer-motion";

import Button from "./general/Button";
import Modal from "./general/Modal";
import Form from "./Form";

export default function Hero() {
    const [ isModalOpen, setModalOpen ] = useState<boolean>(false);

    return (
        <div
            className="relative w-full sm:h-[75vh] h-[60vh] flex flex-col sm:gap-8 gap-4 items-center justify-center"
            style={{
                background: "radial-gradient(circle, rgba(144,0,40,1) 0%, rgba(241,245,249,1) 60%)",
            }}
        >
            {/* Text */}
            <motion.h1 
                animate={{y: 0, opacity: 1}}
                initial={{y: 100, opacity: 0}}
                className="text-center text-brand_black md:text-6xl sm:text-4xl text-3xl md:m-0 pb-4 font-bold w-[90%]">
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
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Join F1GS">
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
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Join F1GS">
                    <Form />
                </Modal>  
            </div>
        </div>
    );
}
