"use client";
import gsap from "gsap";
import CopyChars from "./CopyChars";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import Copy from "./Copy";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);



export default function Vision() {
  const textRef = useRef(null);
  const triggerRef = useRef(null);

  useGSAP(
    () => {
      // Split text animation
      const splitTexte = SplitText.create(textRef.current, {
        type: "words, chars, lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
      });

      let scrollText = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "top top",
          markers: false,
          scrub: true,
        },
      });

      // Set initial state for all characters
      gsap.set(splitTexte.chars, {
        color: "#cccccc !important",
      });

      // Create the color animation
      scrollText.fromTo(
        splitTexte.chars,
        {
          color: "#cccccc",
        },
        {
          color: "#141313ff",
          stagger: {
            each: 0.05,
            from: "start",
          },
        }
      );

      // Cleanup is handled automatically by useGSAP
      return () => {
        if (splitTexte) {
          splitTexte.revert();
        }
      };
    },
    { scope: triggerRef }
  ); // Optional: scope the animation to the trigger element

  return (
    <div className="vision">
      <div
        ref={triggerRef}
        className=" md:ml-[5rem]  py-[1rem] md:py-[2rem] space-y-4 md:space-y-[4rem] first_pin items-center justify-center"
      >
        <div ref={textRef} className="texte_split pl-4 py-12">
          <h1 className="text-[3.2rem] lg:text-[6rem]">
            We capture visuals for companies which appeal to millions of people
            across the globe
          </h1>
        </div>
        <div className="flex items-center justify-end  border-t py-12 md:py-[10rem]">
          <div className="hidden md:block flex-1"></div>
          <div className="flex-1 space-y-12 pr-4">
            <Copy>
              <p className="text-[1.6rem] lg:text-[2rem] pl-4  leading-relaxed tracking-wide text-muted-foreground">
                At our core, we’re a team driven by the passion to capture
                moments you’ll want to remember for a lifetime. From the biggest
                milestones to the quiet instants in between, we believe every
                memory deserves to be preserved .
              </p>
            </Copy>

            <Copy>
              <p className="hidden md:block text-[1.6rem] lg:text-[2rem] pl-4  leading-relaxed tracking-wide text-muted-foreground">
                Our focus is not just on images or footage, but on the emotions,
                stories, and meaning behind them. We strive to create timeless
                visual keepsakes that help you relive the joy, laughter, and
                love of those special times.
              </p>
            </Copy>
            <div className="flex pl-2 pt-12 justify-between max-h-[120px] svg-icons">
              <img src="./adobe-svgrepo-com.svg"/>
              <img src="./apple-svgrepo-com.svg"/>
              <img src="./spotify-svgrepo-com.svg"/>
              <img src="./adobe-svgrepo-com.svg"/>
            </div>
          </div>
        </div>
      </div>
      <div className="vision-bg mt-6  items-center md:ml-[5rem]">
        <CopyChars delay={0.5}>
          <h1 className="text-[3.2rem] lg:text-[8rem] pl-4">Brand Vision</h1>
        </CopyChars>
      </div>
      <div></div>
    </div>
  );
}
