'use client';
// Default Components / React
import React, { useState } from "react";

// Components
import { Twirl as Hamburger } from 'hamburger-react'
import Image from "next/image";
// import { usePathname } from "next/navigation";

// const Section = {
//     "/": "HOME",
//     "/about": "ABOUT",
//     "NEWS",
//     "BOARD",
//     "JOIN"
// }


export default function Navbar() {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState<boolean>(false);
    // const activeSection = usePathname();
    // console.log(activeSection);

    return (
        <div className="
            md:grid md:grid-cols-[20%_1fr_10%] md:p-4
            align-middle sticky gap-8 px-4 pt-4 pb-2 bg-slate-100 rounded-sm shadow-md
            flex justify-between z-[1000] items-center" 
        >
            <Image 
                src={'/logo.png'}
                width={80}
                height={80}
                alt="F1GS Logo"
            />
            
            {/* Desktop Navigation */}
            <div className="hidden md:grid grid-cols-4">
                <div className="flex flex-col items-center justify-center">
                    <h1>About Us</h1>
                    <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1>Our Team</h1>
                    <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1>News</h1>
                    <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1>Join F1GS</h1>
                    <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden overflow-x-hidden">
                <Hamburger 
                    toggled={mobileMenuOpen} 
                    toggle={setMobileMenuOpen} 
                    color="var(--black)"
                />
                {/* Menu */}
                <div className={`fixed top-0 left-0 w-full h-full bg-slate-100 rounded-sm p-4 transition-transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} z-[1000]`}>
                    <div className="align-middle sticky gap-4 grid grid-cols-1">
                        <div className="flex justify-between items-center">
                            <Image 
                                src={'/logo.png'}
                                width={80}
                                height={80}
                                alt="F1GS Logo"
                            />
                            <Hamburger 
                                toggled={mobileMenuOpen} 
                                toggle={setMobileMenuOpen} 
                                color="var(--black)"
                            />
                        </div>
                        <div className="flex flex-col gap-y-4 mx-auto pb-4">
                            <div className="flex flex-col items-center justify-center">
                                <h1>About Us</h1>
                                <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h1>News</h1>
                                <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h1>Our Board</h1>
                                <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h1>Join F1GS</h1>
                                <span className="rounded-full w-2 h-2 bg-brand_black"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}