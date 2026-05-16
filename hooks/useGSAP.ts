"use client";
import { useEffect, useRef, RefObject } from "react";

let gsapInstance: any = null;
let ScrollTriggerInstance: any = null;

export async function loadGSAP() {
  // Guard: only run in browser
  if (typeof window === "undefined") return { gsap: null, ScrollTrigger: null };
  if (gsapInstance) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };

  try {
    const [gsapMod, stMod] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    gsapInstance = gsapMod.gsap || gsapMod.default;
    ScrollTriggerInstance = stMod.ScrollTrigger || stMod.default;

    if (gsapInstance && ScrollTriggerInstance) {
      gsapInstance.registerPlugin(ScrollTriggerInstance);
    }
  } catch (e) {
    console.warn("GSAP load failed, animations disabled:", e);
  }

  return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options?: { y?: number; duration?: number; stagger?: number; delay?: number; selector?: string }
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let ctx: any;
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!gsap || !ref.current) return;
      try {
        const targets = options?.selector
          ? ref.current.querySelectorAll(options.selector)
          : [ref.current];

        ctx = gsap.context(() => {
          gsap.fromTo(
            targets,
            { opacity: 0, y: options?.y ?? 40 },
            {
              opacity: 1, y: 0,
              duration: options?.duration ?? 0.8,
              stagger: options?.stagger ?? 0.12,
              delay: options?.delay ?? 0,
              ease: "power4.out",
              scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            }
          );
        }, ref);
      } catch (e) {
        console.warn("GSAP animation error:", e);
      }
    });
    return () => ctx?.revert?.();
  }, []);
}
