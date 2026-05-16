"use client";
import { useRef, useEffect } from "react";
import { loadGSAP } from "@/hooks/useGSAP";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      gsap.fromTo(leftRef.current?.querySelectorAll("[data-anim]") || [],
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );
      gsap.fromTo(rightRef.current?.querySelectorAll("[data-anim]") || [],
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );
    });
  }, []);

  const openChat = () => document.querySelector<HTMLButtonElement>("[data-chatbot-trigger]")?.click();

  return (
    <section ref={sectionRef} id="about" className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 items-center">
          <div ref={leftRef} className="lg:col-span-2">
            <span data-anim className="font-mono text-accent text-xs sm:text-sm tracking-widest uppercase opacity-0">About</span>
            <h2 data-anim className="font-display font-800 text-[clamp(2rem,4vw,3.5rem)] tracking-tight mt-3 leading-tight opacity-0">
              A one-man agency with<br /><span className="gradient-text">zero compromise.</span>
            </h2>
            <div data-anim className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 opacity-0">
              {[
                { stat: "3+ Years", label: "Building production apps" },
                { stat: "50+ Projects", label: "Across 12 industries" },
              ].map(({ stat, label }) => (
                <div key={stat} className="glass-accent rounded-xl p-4">
                  <div className="font-display font-700 text-xl sm:text-2xl">{stat}</div>
                  <div className="text-text-muted text-xs sm:text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div ref={rightRef} className="lg:col-span-3 space-y-4 sm:space-y-5">
            <p data-anim className="text-text-primary text-base sm:text-lg leading-relaxed opacity-0">
              I'm Bilal. I run W-Agency solo — which means when you hire me, you get me. Not a junior dev. Not a project manager. <em>Me.</em>
            </p>
            <p data-anim className="text-text-secondary text-sm sm:text-base leading-relaxed opacity-0">
              I specialize in Next.js, AI integration, and conversion-focused UI/UX. I've built food delivery platforms, SaaS dashboards, AI chatbots, and e-commerce storefronts. Every project gets full attention — no outsourcing, no half-measures.
            </p>
            <p data-anim className="text-text-secondary text-sm sm:text-base leading-relaxed opacity-0">
              My stack: Next.js 15, TypeScript, Tailwind CSS, Supabase, GSAP, Framer Motion, and Anthropic's Claude API. I build things that don't just look good — they <em>work</em>.
            </p>
            <div data-anim className="flex flex-wrap gap-2 pt-1 opacity-0">
              {["Next.js 15", "TypeScript", "Supabase", "Claude AI", "GSAP", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="tag text-xs sm:text-sm">{tech}</span>
              ))}
            </div>
            <div data-anim className="opacity-0 pt-2">
              <button onClick={openChat} className="btn-primary text-sm sm:text-base px-6 py-3.5">
                Work With Me
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
                  <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
