"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

export default function Hero({ scrollRef, proxyRef, carouselRef }) {
  return (
    <div className="hero">
      <div className="space-y-4 md:space-y-12">
        {/* This is the hero info section with a grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 justify-center md:min-h-[420px] pt-8 mx-4 md:ml-[7rem] justify-between">
          <div className="header md:space-y-0 sm:col-span-2">
            <h1 className="text-[3.8rem] lg:text-[8rem] leading-none flex flex-col md:flex-row font-bold">
              <span>Capturing</span>
              <span className="text-blue-500">Memories</span>
            </h1>
            <h1 className="text-[3.8rem] lg:text-[5rem] leading-none font-bold md:pb-12">
              across time
            </h1>
            <h2 className="text-[1.2rem] lg:text-[1.5rem] leading-none hidden sm:flex">
              Worked with 500+ Brands
            </h2>
          </div>

          <div className="site-info space-y-4 md:space-y-0 pb-2  sm:col-span-1">
            <div className="md:min-h-[240px]"></div>
            <div className="sm:pb-4">
              <h2 className="text-[1.5rem] lg:text-[2rem] leading-none ">
                A team focused on capturing moments you want to remember
              </h2>
            </div>

            <div className="border-b copy-divider"></div>

            <div className="site-info-copy md:pt-4">
              <p className="text-[1rem] lg:text-[1.4rem] leading-none">
                Award winning creative team
              </p>
              <p className="text-[1.2rem] lg:text-[1.2rem] leading-none font-bold">
                Operating since 2019
              </p>
            </div>
          </div>
        </div>
        <div className="border-b w-full carousel-divider"></div>
        <div className="min-h-[240px] md:ml-[5rem] py-8 wrapper opacity-0 ">
          <div className="carousel-reel min-h-[240px] "></div>
          <div className="proxy"></div>
        </div>
      </div>

      <div className="images-container">
        <div className="img">
          <img src="/img1.jpg" />
        </div>
        <div className="img">
          <img src="/img2.jpg" />
        </div>
        <div className="img">
          <img src="/img3.jpg" />
        </div>
        <div className="img">
          <img src="/img4.jpeg" />
        </div>
        <div className="img">
          <img src="/img5.jpg" />
        </div>
        <div className="img">
          <img src="/img6.jpg" />
        </div>
        <div className="img">
          <img src="/img7.png" />
        </div>
        <div className="img">
          <img src="/img8.jpg" />
        </div>
        <div className="img">
          <img src="/img9.jpeg" />
        </div>
        <div className="img">
          <img src="/img10.jpeg" />
        </div>
        <div className="img">
          <img src="/img11.png" />
        </div>
        <div className="img">
          <img src="/img12.png" />
        </div>
      </div>
    </div>
  );
}
