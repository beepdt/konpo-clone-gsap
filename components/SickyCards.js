"use client";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function StickyCards() {

  const container = useRef(null);

   useGSAP(
      () => {
        const cards = document.querySelectorAll(".sticky-card");
        const images = document.querySelectorAll(".sticky-card img");
        const totalCards = cards.length;
  
        gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
        gsap.set(images[0], { scale: 1 });
  
        for (let i = 1; i < totalCards; i++) {
          gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
          gsap.set(images[i], { scale: 1 });
        }
  
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: `+=${window.innerHeight * (totalCards - 1)}`,
            pin: true,
            scrub: 0.5,
          },
        });
  
        for (let i = 0; i < totalCards - 1; i++) {
          const currentCard = cards[i];
          const currentImage = images[i];
          const nextCard = cards[i + 1];
          const position = i;
  
          scrollTimeline.to(
            currentCard,
            {
              scale: 0.5,
              rotation: 10,
              duration: 1,
              ease: "none",
            },
            position
          );
  
          scrollTimeline.to(
            currentImage,
            {
              scale: 1.5,
              duration: 1,
              ease: "none",
            },
            position
          );
  
          scrollTimeline.to(
            nextCard,
            {
              y: "0%",
              duration: 1,
              ease: "none",
            },
            position
          );
        }
  
        return () => {
          scrollTimeline.kill()
          ScrollTrigger.getAll().forEach((trigger)=>trigger.kill())
        }
      },
      { scope: container }
    );
   

  return (
    <div ref={container} className="sticky-cards md:ml-[5rem]">
      <div className="sticky-cards-container">
        {/*Sticky cards start */}
        <div className="sticky-card">
          <div className="sticky-tag  flex">
            <div className="space-y-[1rem] md:space-y-[2rem]  flex-2">
              <h1 className="text-[2.8rem] lg:text-[8rem]">Brand Shoot</h1>
              <p className="text-[1.2rem] lg:text-[2rem]">
                We lay a strong foundation for companies through strategy and
                outstanding visual identity design to help you create lasting
                bonds.
              </p>
              <div className="flex px-4 py-2 bg-black max-w-[160px] text-white rounded-full items-center justify-center">
               <p>Learn More</p>  <ArrowUpRight />
              </div>
            </div>
            <div className="flex-1">
              <img src="/img7.png" className="rounded-xl" />
            </div>
          </div>
        </div>
        <div className="sticky-card">
          <div className="sticky-tag  flex">
            <div className="space-y-[1rem] md:space-y-[2rem] flex-2">
              <h1 className="text-[2.8rem] lg:text-[8rem]">Brand Shoot</h1>
              <p className="text-[1.2rem] lg:text-[2rem]">
                We lay a strong foundation for companies through strategy and
                outstanding visual identity design to help you create lasting
                bonds.
              </p>
              <div className="flex px-4 py-2 bg-foreground max-w-[160px] text-background rounded-full items-center justify-center">
                Learn More <ArrowUpRight />
              </div>
            </div>
            <div className="flex-1">
              <img src="/img12.png" className="rounded-xl" />
            </div>
          </div>
        </div>
        <div className="sticky-card">
          <div className="sticky-tag  flex">
            <div className="space-y-[1rem] md:space-y-[2rem] flex-2">
              <h1 className="text-[2.8rem] lg:text-[8rem]">Brand Shoot</h1>
              <p className="text-[1.2rem] lg:text-[2rem]">
                We lay a strong foundation for companies through strategy and
                outstanding visual identity design to help you create lasting
                bonds.
              </p>
              <div className="flex px-4 py-2 bg-foreground max-w-[160px] text-background rounded-full items-center justify-center">
                Learn More <ArrowUpRight />
              </div>
            </div>
            <div className="flex-1">
              <img src="/img11.png" className="rounded-xl" />
            </div>
          </div>
        </div>
        <div className="sticky-card">
          <div className="sticky-tag  flex">
            <div className="space-y-[1rem] md:space-y-[2rem] justify-between flex-2">
              <h1 className="text-[2.8rem] lg:text-[8rem]">Brand Shoot</h1>
              <p className="text-[1.2rem] lg:text-[2rem]">
                We lay a strong foundation for companies through strategy and
                outstanding visual identity design to help you create lasting
                bonds.
              </p>
              <div className="flex px-4 py-2 bg-foreground max-w-[160px] text-background rounded-full items-center justify-center">
                Learn More <ArrowUpRight />
              </div>
            </div>
            <div className="flex-1">
              <img src="/img6.jpg" className="rounded-xl" />
            </div>
          </div>
        </div>
        {/*Sicky cards end */}
      </div>
    </div>
  );
}
