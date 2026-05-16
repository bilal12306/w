"use client";
import { useEffect, useRef } from "react";
import { loadGSAP } from "@/hooks/useGSAP";

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const card1Ref    = useRef<HTMLDivElement>(null);
  const card2Ref    = useRef<HTMLDivElement>(null);
  const orb1Ref     = useRef<HTMLDivElement>(null);
  const orb2Ref     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!gsap) return;
      try {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        if (badgeRef.current) {
          tl.fromTo(badgeRef.current, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
        }

        if (headlineRef.current) {
          const lines = headlineRef.current.querySelectorAll(".hero-line");
          if (lines.length) tl.fromTo(lines, { opacity: 0, y: 60, skewY: 4 }, { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.13 }, "-=0.2");
        }

        if (subRef.current) tl.fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");

        const ctaBtns = ctaRef.current?.querySelectorAll("a, button");
        if (ctaBtns?.length) tl.fromTo(ctaBtns, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 }, "-=0.4");

        const statItems = statsRef.current?.querySelectorAll(".stat-item");
        if (statItems?.length) tl.fromTo(statItems, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.3");

        const cards = [card1Ref.current, card2Ref.current].filter(Boolean);
        if (cards.length) tl.fromTo(cards, { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.5");

        if (card1Ref.current) gsap.to(card1Ref.current, { y: -14, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (card2Ref.current) gsap.to(card2Ref.current, { y: -10, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });

        if (ScrollTrigger && orb1Ref.current) {
          gsap.to(orb1Ref.current, { y: -120, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 } });
        }
        if (ScrollTrigger && orb2Ref.current) {
          gsap.to(orb2Ref.current, { y: -80, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 } });
        }
      } catch (e) {
        console.warn("Hero animation error:", e);
      }
    });

    // Counter animation
    const counters = document.querySelectorAll<HTMLElement>("[data-counter]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.counter || "0");
        const suffix = el.dataset.suffix || "";
        let current = 0;
        const inc = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + inc, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openChat = () => document.querySelector<HTMLButtonElement>("[data-chatbot-trigger]")?.click();

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 px-5 sm:px-6">
      <div ref={orb1Ref} className="orb w-[min(600px,100vw)] h-[min(600px,100vw)] top-[-150px] left-[-150px] opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5E4BF0 0%, transparent 70%)" }} />
      <div ref={orb2Ref} className="orb w-[min(400px,80vw)] h-[min(400px,80vw)] bottom-[-80px] right-[-80px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D6B 0%, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-accent mb-8 mx-auto">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-mono text-text-secondary">Available for new projects</span>
        </div>

        <h1 ref={headlineRef} className="font-display font-800 text-[clamp(2.8rem,9vw,7rem)] leading-[0.93] tracking-tight mb-6">
          <span className="hero-line block text-text-primary overflow-hidden">We Build</span>
          <span className="hero-line block gradient-text overflow-hidden">Digital Experiences</span>
          <span className="hero-line block text-text-primary overflow-hidden">That Convert.</span>
        </h1>

        <p ref={subRef} className="text-text-secondary text-[clamp(0.95rem,2.2vw,1.25rem)] max-w-xl mx-auto leading-relaxed mb-10 px-2">
          From $100 landing pages to $500 AI-powered platforms — W-Agency ships work that makes clients stay and visitors buy.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 px-4">
          <a href="#projects" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center">
            View Our Work
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <button onClick={openChat} className="btn-ghost text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center">
            Get a Free Quote
          </button>
        </div>

        <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {[{ value: 50, suffix: "+", label: "Projects Shipped" }, { value: 100, suffix: "%", label: "Client Satisfaction" }, { value: 3, suffix: "x", label: "Avg. Conversion Lift" }].map(({ value, suffix, label }) => (
            <div key={label} className="stat-item text-center">
              <div className="font-display font-800 text-3xl sm:text-4xl text-text-primary">
                <span data-counter={value} data-suffix={suffix}>0{suffix}</span>
              </div>
              <div className="text-text-muted text-xs sm:text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div ref={card1Ref} className="hidden lg:block absolute right-8 xl:right-16 top-[38%] -translate-y-1/2">
        <div className="glass border border-border-subtle rounded-2xl p-4 w-48">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-sm">⚡</div>
            <span className="text-xs font-display font-600 text-text-primary">Fast Delivery</span>
          </div>
          <p className="text-xs text-text-muted">Projects live in 3–7 days</p>
        </div>
      </div>

      <div ref={card2Ref} className="hidden lg:block absolute left-8 xl:left-16 bottom-[30%]">
        <div className="glass border border-border-subtle rounded-2xl p-4 w-48">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center text-sm">🤖</div>
            <span className="text-xs font-display font-600 text-text-primary">AI-Powered</span>
          </div>
          <p className="text-xs text-text-muted">Intelligent solutions built in</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-xs font-mono text-text-muted tracking-widest uppercase hidden sm:block">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-text-muted to-transparent" />
      </div>
    </section>
  );
}
