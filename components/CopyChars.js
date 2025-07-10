import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import React from "react";
gsap.registerPlugin(SplitText, ScrollTrigger);

//@ts-ignore
export default function CopyChars({ children, animateOnScroll = true, delay = 0 }) {
  const containerRef = useRef(null);
  const elementRef = useRef([]);
  const splitRef = useRef([]);
  const chars = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      splitRef.current = [];
      elementRef.current = [];
      chars.current = [];

      let elements = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        elementRef.current.push(element);

        const split = SplitText.create(element, {
          type: "chars",
          mask: "chars",
          charsClass: "char++",
        });
        splitRef.current.push(split);

        chars.current.push(...split.chars);
      });

      gsap.set(chars.current, {
        y: "100%",
        opacity: 0.8
      });
      const animationProps = {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.04,
        ease: "power4.out",
        delay: delay,
      };
      if (animateOnScroll) {
        gsap.to(chars.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      } else {
        gsap.to(chars.current,animationProps);
      }

      return () => {
        splitRef.current.forEach((split)=> {
            if(split){
                split.revert();
            }
        })
      }
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    }
  );

  if(React.Children.count(children)===1) {
    return React.cloneElement(children, {ref: containerRef} );
  }
  return (
    
    <div  ref= {containerRef} data-copy-wrapper="true"
    >
        {children}
    </div>
  )
}