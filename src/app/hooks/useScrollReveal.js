"use client";
import { useEffect } from "react";

/**
 * useScrollReveal
 * Watches every element tagged with [data-reveal] and adds the
 * `.visible` class once it enters the viewport. CSS drives the
 * actual animation; this hook just toggles the class.
 *
 * Usage in JSX:
 *   <div data-reveal="fade-up" data-delay="0.1">...</div>
 *
 * Supported variants (set via data-reveal attr):
 *   fade-up | fade-left | fade-right | zoom-in | slide-down
 *
 * NOTE: Observer starts after INTRO_DURATION so logo intro
 * animations finish before section animations begin.
 */

const INTRO_DURATION = 2800; // must match LogoIntro done timeout

export default function useScrollReveal() {
  useEffect(() => {
    let observer;

    const startObserver = () => {
      const elements = document.querySelectorAll("[data-reveal]");

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const delay = el.getAttribute("data-delay") || "0";
              el.style.transitionDelay = `${delay}s`;
              el.classList.add("visible");
            } else {
              // Remove visible class when scrolling back up/away
              entry.target.classList.remove("visible");
            }
          });
        },
        { threshold: 0.12 }
      );

      elements.forEach((el) => observer.observe(el));
    };

    // Delay observer start until logo intro is fully done
    const timer = setTimeout(startObserver, INTRO_DURATION);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);
}
