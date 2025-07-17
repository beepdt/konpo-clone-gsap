"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/hero";
import Copy from "@/components/Copy";
import { Menu } from "lucide-react";
import Vision from "@/components/vision";
import animations from "@/components/page-func";
import Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import Footer from "@/components/Footer";
gsap.registerPlugin(useGSAP, Flip, SplitText, Draggable, ScrollTrigger);

//DragScrollClass

//Page
export default function Home() {
  const sidebarRef = useRef(null);
  const lenis = useLenis(({scoll})=>{})
  const router = useRouter()
  animations();

  

  return (
    <ReactLenis as root>
      <div className="max-w-screen relative">
      <div ref={sidebarRef} className="sidebar">
        <div className="divider"></div>
      </div>
      <div className="hero-bg overflow-x-hidden"></div>
      <div className="nav relative h-[4rem] sm:h-[4.2rem] md:h-[5rem] z-100 md:text-[2rem] items-center">
        <div className="px-4 md:pl-[1.8rem] justify-between items-center flex h-full">
          <div className="flex items-center h-full  md:border-0 ">
            <div className="menu-icon opacity-0">
              <Menu />
            </div>
            <div className="border-r h-full pr-4 menu-divider"></div>
            <div className="logo-name font-bold md:pl-[3.8rem]">
              <p>Foto.io</p>
            </div>
          </div>
          <div className="space-x-4 sm:space-x-8 flex nav-items items-center">
            <div 
            onClick={()=> router.push('./gallery')}
            className="links bg-black hover:underline cursor-pointer hover:text-gray-400 text-background md:bg-transparent md:text-foreground rounded-2xl opacity-0 px-4 py-2 md:opacity-1 md:px-0 md:py-0">
              <p className="hover:underline">Gallery</p>
            </div>
            <div className="hidden cta sm:flex bg-black text-background rounded-full opacity-0 px-4 py-2">
              <p className="text-[1.2rem]">Contact Me</p>
            </div>
          </div>
        </div>
        <div className="divider"></div>
      </div>

      <div className="sidebar ">
        <div className="divider"></div>
      </div>

      <div className="counter">
        <div className="counter-1 digit"></div>
        <div className="counter-2 digit"></div>
        <div className="counter-3 digit"></div>
      </div>

      <div  className="flex flex-col relative">
        <Hero />

        <Vision />

        <div className="Footer">
          <Footer/>
        </div>
      </div>
    </div>
    </ReactLenis>
    
  );
}
