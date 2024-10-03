import About from "@/components/About";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar /> 
      <Hero />
      <div id="about">
        <About />
      </div>
    </>
  );
}
