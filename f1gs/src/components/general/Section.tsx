"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface SectionProps {
  id: string;
  children: ReactNode;
  baseUrl?: boolean;
  setActiveSection: (section: string) => void;
}

export default function Section({
  id,
  children,
  baseUrl = false,
  setActiveSection,
}: SectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      if (baseUrl) {
        window.history.replaceState(null, "", "/");
        setActiveSection("");
      } else {
        window.history.replaceState(null, "", `#${id}`);
        setActiveSection(id);
      }
    }
  }, [isInView, id, baseUrl]);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="scroll-mt-9"
    >
      {children}
    </motion.section>
  );
}
