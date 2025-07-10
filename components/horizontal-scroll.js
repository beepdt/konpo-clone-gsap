"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, Flip, SplitText, Draggable);

export default function Home() {
  const horizontalScrollRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const draggableInstance = useRef(null);

  const setupTextSplitting = () => {
    const textElements = document.querySelectorAll("h1, h2, p, a");
    textElements.forEach((element) => {
      SplitText.create(element, {
        type: "lines",
        linesClass: "line",
      });

      const lines = element.querySelectorAll(".line");
      lines.forEach((line) => {
        const textContent = line.textContent;
        line.innerHTML = `<span>${textContent}</span>`;
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

  const setupHorizontalScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    const horizontalScroll = horizontalScrollRef.current;

    if (!scrollContainer || !horizontalScroll) return;
    if (draggableInstance.current) {
      draggableInstance.current.kill();
    }

    const scrollImages = horizontalScroll.querySelectorAll(".scroll-img");

    let totalWidth = 0;
    scrollImages.forEach((img) => {
      totalWidth += img.offsetWidth;
    });
    // Add gap space (1rem = 16px for each gap)
    totalWidth += (scrollImages.length - 1) * 16;

    const containerWidth = scrollContainer.offsetWidth;
    const maxScroll = Math.max(0, totalWidth - containerWidth);

    const draggable = Draggable.create(horizontalScroll, {
      type: "x",
      bounds: {
        minX: -maxScroll,
        maxX: 0,
      },
      inertia: true,
      trigger: scrollContainer,
      allowEventDefault: false,
      dragClickables: true,
      onDrag: () => {
        const sidebarWidth = window.innerWidth >= 768 ? 80 : 0;
        const scrollRect = horizontalScroll.getBoundingClientRect();

        scrollImages.forEach((img) => {
          const imgRect = img.getBoundingClientRect();

          if (imgRect.left < sidebarWidth) {
            gsap.set(img, { opacity: 1 });
          } else {
            gsap.set(img, { opacity: 1 });
          }
        });
      },

      onDragEnd: () => {
        gsap.set(scrollImages, {
          opacity: 1,
        });
      },
    });
    draggableInstance.current = draggable[0];
    return draggable[0];
  };

  const animateImages = () => {
    const images = document.querySelectorAll(".img");

    const horizontalScroll = horizontalScrollRef.current;
    // const firstScrollImg = horizontalScroll.querySelector(".scroll-img");

    const scrollImages = horizontalScroll?.querySelectorAll(".scroll-img");

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

    //spreading animation
    mainTimeline.call(() => {
      const stackedImages = Flip.getState(images);

      const scrollImagePositions = Array.from(scrollImages).map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      });

      //const firstScrollImgRect = firstScrollImg.getBoundingClientRect();

      const isMobile = window.innerWidth < 768;

      const firstImg = images[0];

      const stackedPosition = images[0].getBoundingClientRect();
      const spreadTimeline = gsap.timeline();

      Array.from(images)
        .slice(0, 7)
        .forEach((img, index) => {
          const targetPos = scrollImagePositions[index];

          gsap.set(img, {
            position: "fixed",
            left: stackedPosition.left + "px",
            top: stackedPosition.top + "px",
            width: stackedPosition.width + "px",
            height: stackedPosition.height + "px",
            zIndex: 1000 + index,
            transformOrigin: "center center",
          });

          spreadTimeline.to(
            img,
            {
              left: targetPos.left + "px",
              top: targetPos.top + "px",
              width: targetPos.width + "px",
              height: targetPos.height + "px",
              duration: 1.2,
              ease: "power3.inOut",
            },
            index * 0.1
          );
        });

      Array.from(images)
        .slice(7)
        .forEach((img) => {
          gsap.set(img, { opacity: 0, scale: 0 });
        });

      spreadTimeline.call(() => {
        Array.from(images)
          .slice(0, 7)
          .forEach((img) => {
            gsap.set(img, { opacity: 0 });
          });

        gsap.set(horizontalScroll, { opacity: 1 });

        // Setup draggable
        setTimeout(() => {
          setupHorizontalScroll();
        }, 100);
      });

      mainTimeline.add(spreadTimeline, "+=0.5");
    });

    return mainTimeline;
  };

  useEffect(() => {
    const handleResize = () => {
      if (horizontalScrollRef.current && scrollContainerRef.current) {
        setTimeout(() => {
          setupHorizontalScroll();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    setupTextSplitting();
    createCounterDigits();

    animateCounter(document.querySelector(".counter-3"), 2.5);
    animateCounter(document.querySelector(".counter-2"), 3);
    animateCounter(document.querySelector(".counter-1"), 1.5);

    const tl = gsap.timeline();
    gsap.set(".img", {
      scale: 0,
    });
    gsap.set(".horizontal-scroll", { opacity: 0 });

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

    tl.to(".sidebar .divider", {
      scaleY: "100%",
      duration: 1,
      ease: "power3.inOut",
      delay: 1.25,
    });

    tl.to(
      [".nav .divider", ".site-info .divider"],
      {
        scaleX: "100%",
        duration: 1,
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
      [".logo-name p span", ".links p span, .links p span", ".cta p span"],
      {
        y: "0%",
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
  });

  return (
    <div className=" overflow-x-hidden">
      <div ref={sidebarRef} className="sidebar">
        <div className="divider"></div>
      </div>
      <div className="hero-bg"></div>
      <div className="nav relative h-[4rem] sm:h-[4.2rem] md:h-[5rem] z-100 md:text-[2rem] items-center">
        <div className="px-4 md:pl-[7rem] justify-between items-center flex h-full">
          <div>
            <div className="logo-name font-bold">
              <p>Foto.io</p>
            </div>
          </div>
          <div className="space-x-4 sm:space-x-8 flex nav-items">
            <div className="links">
              <p>Gallery</p>
            </div>
            <div className="hidden cta sm:flex ">
              <p>Contact Me</p>
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

      <div className="hero">
        <div className="grid grid-cols-1 sm:grid-cols-2 justify-center md:h-[420px] pt-8 px-4 md:pl-[7rem]">
          <div className="header space-y-4 md:space-y-0 ">
            <h1 className="text-[3.8rem] lg:text-[6rem] leading-none md:h-[420px] font-bold">
              Capturing <span className="text-blue-500">Memories</span> across
              time
            </h1>
            <h2 className="text-[1.2rem] lg:text-[1.5rem] leading-none hidden sm:flex">
              Worked with 500+ Brands
            </h2>
          </div>

          <div className="site-info space-y-4 md:space-y-0 ">
            <div className="md:h-[320px]"></div>
            <div className="sm:pb-4">
              <h2 className="text-[1.5rem] lg:text-[2.5rem] leading-none">
                A team focused on capturing moments you want to remember
              </h2>
            </div>
            <div className="divider"></div>
            <div className="site-info-copy md:pt-4">
              <p className="text-[1.2rem] lg:text-[2rem] leading-none">
                Award winning creative team
              </p>
              <p className="text-[1.2rem] lg:text-[2rem] leading-none">
                Operating since 2019
              </p>
            </div>
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

        <div
          ref={scrollContainerRef}
          className="horizontal-scroll-container relative min-w-screen border  md:ml-[7rem] mt-16 md:mt-32"
        >
          <div
            className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
            style={{
              background: "transparent",
              touchAction: "none",
            }}
          />
          <div
            ref={horizontalScrollRef}
            className="horizontal-scroll flex gap-4 cursor-grab active:cursor-grabbing"
          >
            <div className="scroll-img border flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img1.jpg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img2.jpg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img3.jpg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img4.jpeg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img5.jpg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img6.jpg"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
            <div className="scroll-img flex-shrink-0 w-[280px] md:w-[320px] h-[200px] md:h-[240px]">
              <img
                src="/img7.png"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                tabIndex="-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="vision"></div>
      <div className="selected-works"></div>
    </div>
  );
}
