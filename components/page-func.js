import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, Flip, SplitText, Draggable);

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

class DragScroll {
  constructor(obj) {
    this.el = document.querySelector(obj.el);
    this.wrap = document.querySelector(obj.wrap);
    this.items = document.querySelectorAll(obj.item);
    this.sensitivity = obj.sensitivity || 1;
    this.friction = obj.friction || 0.08;
    this.init();
  }

  init() {
    this.progress = 0;
    this.targetProgress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.scale = 1;
    this.velocity = 0;
    this.isScrolling = false;
    this.isDragging = false;
    this.playrate = 0;

    this.preventSelection();
    this.bindings();
    this.events();
    this.calculate();
    this.raf();
  }

  preventSelection() {
    // Prevent image selection and dragging
    this.items.forEach((item) => {
      item.style.userSelect = "none";
      item.style.webkitUserSelect = "none";
      item.style.mozUserSelect = "none";
      item.style.msUserSelect = "none";

      const img = item.querySelector("img");
      if (img) {
        img.style.userSelect = "none";
        img.style.webkitUserSelect = "none";
        img.style.pointerEvents = "none";
        img.draggable = false;
      }
    });
  }

  bindings() {
    [
      "events",
      "calculate",
      "raf",
      "handleWheel",
      "move",
      "handleTouchStart",
      "handleTouchMove",
      "handleTouchEnd",
      "handleResize",
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  calculate() {
    if (!this.items.length) return;

    this.itemWidth = this.items[0].clientWidth;
    this.wrapWidth =
      this.itemWidth * this.items.length + 12 * (this.items.length - 1);
    this.wrap.style.width = `${this.wrapWidth}px`;

    // Calculate maxScroll with extra padding after last item
    const containerWidth = this.el.clientWidth;
    const extraPadding = 210; // pixels of space after last item
    this.maxScroll = Math.max(0, this.wrapWidth - containerWidth);
  }

  handleWheel(e) {
    e.preventDefault();

    const delta = e.deltaY * this.sensitivity;
    this.targetProgress += delta;
    this.velocity = delta * 0.5;
    this.isScrolling = true;

    // Auto-stop scrolling state
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);

    this.move();
  }

  handleTouchStart(e) {
    this.isDragging = true;
    this.startX = e.clientX || e.touches[0].clientX;
    this.startProgress = this.progress;
    this.velocity = 0;
    this.lastMoveTime = Date.now();
    this.lastMoveX = this.startX;

    // Add momentum tracking
    this.moveHistory = [];
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    const currentX = e.clientX || e.touches[0].clientX;
    const deltaX = this.startX - currentX;
    const currentTime = Date.now();

    // Track movement for momentum
    this.moveHistory.push({
      x: currentX,
      time: currentTime,
    });

    // Keep only recent history
    if (this.moveHistory.length > 3) {
      this.moveHistory.shift();
    }

    this.targetProgress = this.startProgress + deltaX * 1.5;
    this.move();
  }

  handleTouchEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Calculate momentum from recent movement
    if (this.moveHistory.length >= 2) {
      const recent = this.moveHistory[this.moveHistory.length - 1];
      const previous = this.moveHistory[this.moveHistory.length - 2];
      const timeDiff = recent.time - previous.time;
      const distance = recent.x - previous.x;

      if (timeDiff > 0) {
        this.velocity = -(distance / timeDiff) * 15; // Momentum multiplier
        this.targetProgress += this.velocity;
      }
    }

    this.moveHistory = [];
    this.move();
  }

  handleResize() {
    this.calculate();
  }

  move() {
    // Clamp progress to valid range (0 to maxScroll)
    this.targetProgress = clamp(this.targetProgress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener("resize", this.handleResize);
    //this.el.addEventListener("wheel", this.handleWheel, { passive: false });

    // Touch events
    this.el.addEventListener("touchstart", this.handleTouchStart, {
      passive: true,
    });
    this.el.addEventListener("touchmove", this.handleTouchMove, {
      passive: true,
    });
    this.el.addEventListener("touchend", this.handleTouchEnd, {
      passive: true,
    });

    // Mouse events for desktop drag
    this.el.addEventListener("mousedown", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleTouchMove);
    window.addEventListener("mouseup", this.handleTouchEnd);

    // Prevent context menu on drag
    this.el.addEventListener("contextmenu", (e) => {
      if (this.isDragging) e.preventDefault();
    });
  }

  raf() {
    // Smooth interpolation with variable friction
    const friction = this.isDragging ? 0.15 : this.friction;
    this.progress = lerp(this.progress, this.targetProgress, friction);

    // Apply momentum decay
    if (!this.isDragging && !this.isScrolling) {
      this.velocity *= 0.95;
      this.targetProgress += this.velocity;
      // Clamp after applying velocity
      this.targetProgress = clamp(this.targetProgress, 0, this.maxScroll);
    }

    // Calculate smooth speed for scaling
    this.speed = Math.abs(this.progress - this.oldX);
    this.oldX = this.progress;

    // Update transforms
    this.wrap.style.transform = `translateX(${-this.progress}px)`;

    // Enhanced item scaling with easing
    const maxSpeed = 5;
    const normalizedSpeed = Math.min(this.speed / maxSpeed, 1);
    const targetScale = 1 - normalizedSpeed * 0.08;
    const targetImageScale = 1 + normalizedSpeed * 0.12;

    this.scale = lerp(this.scale, targetScale, 0.1);
    this.imageScale = lerp(this.imageScale || 1, targetImageScale, 0.1);

    // Apply scaling to items
    this.items.forEach((item, index) => {
      const itemCenter = index * this.itemWidth + this.itemWidth / 2;
      const viewportCenter = this.progress + this.el.clientWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      const maxDistance = this.el.clientWidth / 2;
      const parallaxFactor = 1 - Math.min(distance / maxDistance, 1);

      const finalScale = this.scale;

      item.style.transform = `scale(${finalScale})`;

      const img = item.querySelector("img");
      if (img) {
        img.style.transform = `scaleX(${this.imageScale}) scaleY(${
          1 + parallaxFactor * 0.02
        })`;
      }
    });

    // Update playrate for other animations
    this.playrate = this.maxScroll > 0 ? this.progress / this.maxScroll : 0;
  }

  // Public methods for external control
  scrollTo(index, smooth = true) {
    const targetPos = index * this.itemWidth;
    this.targetProgress = clamp(targetPos, 0, this.maxScroll);

    if (!smooth) {
      this.progress = this.targetProgress;
    }
  }

  destroy() {
    // Cleanup event listeners
    window.removeEventListener("resize", this.handleResize);
    this.el.removeEventListener("wheel", this.handleWheel);
    this.el.removeEventListener("touchstart", this.handleTouchStart);
    this.el.removeEventListener("touchmove", this.handleTouchMove);
    this.el.removeEventListener("touchend", this.handleTouchEnd);
    this.el.removeEventListener("mousedown", this.handleTouchStart);
    window.removeEventListener("mousemove", this.handleTouchMove);
    window.removeEventListener("mouseup", this.handleTouchEnd);

    clearTimeout(this.scrollTimeout);
  }
}

export default function animations () {
  const scrollInstanceRef = useRef(null);
  const animationFrameRef = useRef(null);

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
        stagger: 0.04,
        ease: "power4.out",
        absolute: true,
        simple: true,
      });
      mainTimeline.add(spreadTimeline);
    });

    //spreading animation

    return mainTimeline;
  };

  //initialize dragScroll
  const initializeDragScroll = () => {
    // Check if elements exist before initializing
    const slider = document.querySelector(".slider");
    const carouselReel = document.querySelector(".carousel-reel");
    const carouselItems = document.querySelectorAll(".carousel-item");

    if (slider && carouselReel && carouselItems.length > 0) {
      scrollInstanceRef.current = new DragScroll({
        el: ".slider",
        wrap: ".carousel-reel",
        item: ".carousel-item",
      });

      const animateScroll = () => {
        if (scrollInstanceRef.current) {
          scrollInstanceRef.current.raf();
        }
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      };

      animateScroll();
    }
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
        initializeDragScroll();
        // Small delay to ensure DOM is ready
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

    tl.to(
      ".wrapper",
      {
        scaleX: "100%",
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );

    tl.to([".sidebar .divider", ".menu-divider"], {
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
};
