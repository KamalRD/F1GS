import About from "@/sections/About";
import Board from "@/sections/Board";
import Hero from "@/sections/Hero";
import Navbar from "@/sections/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Board />
    </>
  );
}
