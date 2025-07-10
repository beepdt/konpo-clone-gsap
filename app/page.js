"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
import Hero from "@/components/hero";
import Copy from "@/components/Copy";
import { Menu } from "lucide-react";
gsap.registerPlugin(useGSAP, Flip, SplitText, Draggable);

export default function Home() {
  const sidebarRef = useRef(null);

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  //drag animation

  const animationRefs = useRef({
    scrollTween: null,
    horizontalScroll: null,
    drag: null,
    clamp: null,
    dragRatio: 0,
  });

  const setupTextSplitting = () => {
    const textElements = document.querySelectorAll(
      ".hero h1,.hero h2,.nav p,.hero p,.nav a"
    );
    textElements.forEach((element) => {
      SplitText.create(element, {
        type: "lines",
        linesClass: "line",
      });

      const lines = element.querySelectorAll(".line");
      lines.forEach((line) => {
        const existingContent = line.innerHTML;

        // Create a wrapper span that preserves the original content
        const wrapper = document.createElement("span");
        wrapper.innerHTML = existingContent;
        wrapper.style.display = "inline-block";

        // Clear the line and add the wrapper
        line.innerHTML = "";
        line.appendChild(wrapper);
      });
    });
  };

  const createCounterDigits = () => {
    const counter1 = document.querySelector(".counter-1");
    const num0 = document.createElement("div");
    num0.className = "num";
    num0.textContent = "0";
    counter1.appendChild(num0);

    const num1 = document.createElement("div");
    num1.className = "num num1offset1";
    num1.textContent = "1";
    counter1.appendChild(num1);

    const counter2 = document.querySelector(".counter-2");
    for (let i = 0; i <= 10; i++) {
      const numDiv = document.createElement("div");
      numDiv.className = i == 1 ? "num num1offset2" : "num";
      numDiv.textContent = i == 10 ? "0" : i;
      counter2.appendChild(numDiv);
    }

    const counter3 = document.querySelector(".counter-3");
    for (let i = 0; i < 30; i++) {
      const numDiv = document.createElement("div");
      numDiv.className = "num";
      numDiv.textContent = i % 10;
      counter3.appendChild(numDiv);
    }

    const finalNum = document.createElement("div");
    finalNum.className = "num";
    finalNum.textContent = "0";
    counter3.appendChild(finalNum);
  };

  const animateCounter = (counter, duration, delay = 0) => {
    const numHeight = counter.querySelector(".num").clientHeight;
    const totalDistance =
      (counter.querySelectorAll(".num").length - 1) * numHeight;

    gsap.to(counter, {
      y: -totalDistance,
      duration: duration,
      delay: delay,
      ease: "power2.inOut",
    });
  };

  const animateImages = () => {
    const images = document.querySelectorAll(".img");
    const carouselReel = document.querySelector(".carousel-reel");
    const imageContainer = document.querySelector(".images-container");

    //intial animation
    images.forEach((img) => {
      img.classList.remove("animate-out", "spread-out");
    });

    const state = Flip.getState(images);

    images.forEach((img) => img.classList.add("animate-out"));

    const mainTimeline = gsap.timeline();

    mainTimeline.add(
      Flip.from(state, {
        duration: 1,
        stagger: 0.1,
        ease: "power3.inOut",
        absolute: true,
      })
    );

    images.forEach((img, index) => {
      const scaleTimeline = gsap.timeline();

      scaleTimeline
        .to(
          img,
          {
            scale: 2.5,
            duration: 0.45,
            ease: "power3.in",
          },
          0.025
        )
        .to(
          img,
          {
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0.5
        );

      mainTimeline.add(scaleTimeline, index * 0.1);
    });

    //scroll
    mainTimeline.call(() => {
      const preCarouselState = Flip.getState(images);

      images.forEach((img) => {
        gsap.set(img, { clearProps: "transform" });

        // Move the element to be a child of carousel-reel
        carouselReel.appendChild(img);
        // Change className from "img" to "carousel-item"
        img.classList.remove("img", "animate-out");
        img.classList.add("carousel-item");
        if (imageContainer) {
          imageContainer.style.zIndex = "-999";
        }
      });

      const spreadTimeline = Flip.from(preCarouselState, {
        duration: 0.5,
        stagger: 0.06,
        ease: "power4.inOut",
        absolute: true,
        simple: true,
      });
      mainTimeline.add(spreadTimeline);
    });

    //spreading animation

    return mainTimeline;
  };

  useGSAP(() => {
    setupTextSplitting();
    createCounterDigits();

    animateCounter(document.querySelector(".counter-3"), 2.5);
    animateCounter(document.querySelector(".counter-2"), 3);
    animateCounter(document.querySelector(".counter-1"), 1.5);

    const tl = gsap.timeline({
      onStart: () => {
        disableScroll();
      },
      onComplete: () => {
        enableScroll();
      },
    });
    gsap.set(".img", {
      scale: 0,
    });

    tl.to(".hero-bg", {
      scaleY: "100%",
      duration: 3,
      ease: "power2.inOut",
      delay: 0.25,
    });

    tl.to(
      ".img",
      {
        scale: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power1.inOut",
      },
      "<"
    );

    tl.to(".counter", {
      opacity: 0,
      duration: 0.3,
      ease: "power3.inOut",
      delay: 0.3,
      onStart: () => {
        animateImages();
      },
    });

    tl.to(".wrapper", {
      scaleX: "100%",
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    tl.to([".sidebar .divider",".menu-divider"], {
      scaleY: "100%",
      duration: 1,
      ease: "power3.inOut",
      delay: 1.25,
    });

    tl.to(
      ".carousel-divider",
      {
        scaleX: "100%",
        duration: 1.5,
        stagger: 0.5,
        ease: "power3.inOut",
      },
      "<"
    );

    tl.to(
      [
        ".nav .divider",
        ".site-info .divider",
        ".hero-info .divider",
        ".copy-divider",
      ],
      {
        scaleX: "100%",
        duration: 1.5,
        stagger: 0.5,
        ease: "power3.inOut",
      },
      "<"
    );

    tl.to(
      ".logo",
      {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    );

    tl.to(
      [
        ".logo-name p span",
        ".links p span, .links p span",
        ".cta p span",
        ".cta",
        ".links",
        ".menu-icon",
      ],
      {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.5,
      },
      "<"
    );

    tl.to(
      [".header span", ".site-info span", ".hero-footer span"],
      {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      },
      "<"
    );

    //drag
  });

  return (
    <div className="">
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
            <div className="links bg-black text-background md:bg-transparent md:text-foreground rounded-2xl opacity-0 px-4 py-2 md:opacity-1 md:px-0 md:py-0">
              <p>Gallery</p>
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

      <div className="flex flex-col">
        <Hero />

        <div className="vision  h-screen">
          <Copy>
            <h1 className="text-[7rem]">This is a test Text</h1>
          </Copy>
        </div>
        <div className="selected-works"></div>
      </div>
    </div>
  );
}
