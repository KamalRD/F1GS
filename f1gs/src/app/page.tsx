"use client";

import React, { useState } from "react";
import About from "@/sections/About";
import Board from "@/sections/Board";
import Hero from "@/sections/Hero";
import Navbar from "@/sections/Navbar";

import Section from "@/components/general/Section";
import Events from "@/sections/Events";
import Footer from "@/sections/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("");
  return (
    <>
      <Navbar activeSection={activeSection} />
      <Section id="hero" baseUrl={true} setActiveSection={setActiveSection}>
        <Hero />
      </Section>
      <Section id="about" setActiveSection={setActiveSection}>
        <About />
      </Section>
      <Section id="team" setActiveSection={setActiveSection}>
        <Board />
      </Section>
      <Section id="events" setActiveSection={setActiveSection}>
        <Events />
      </Section>
      <Footer></Footer>
    </>
  );
}
