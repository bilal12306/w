"use client";
import { useRef, useEffect } from "react";
import { loadGSAP } from "@/hooks/useGSAP";

const services = [
  {
    icon: "⚡", title: "Frontend Websites", price: "$100 – $200",
    description: "Clean, fast, modern frontends. Basic at $100, animated & premium UI/UX at $150–$200. Custom-built, never templated.",
    items: ["Mobile-first responsive", "SEO-optimized markup", "Sub-2s load time", "Framer Motion / GSAP"],
  },
  {
    icon: "🏗️", title: "Full-Stack Platforms", price: "$300 – $450",
    description: "Complete web apps with database, authentication, admin dashboards, and real-time features. Built for scale.",
    items: ["Next.js App Router", "Supabase backend", "Admin dashboard", "Stripe payments"],
  },
  {
    icon: "🤖", title: "AI-Powered Apps", price: "$450 – $600+",
    description: "Intelligent platforms with embedded AI — chatbots, copilots, and smart workflows that actually work.",
    items: ["Claude / GPT integration", "Custom AI assistants", "Automated workflows", "Real-time AI features"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      const anim = (el: Element | null, vars: object, trigger: Element | null) =>
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, ...vars, ease: "power4.out",
          scrollTrigger: { trigger, start: "top 85%", once: true },
        });

      anim(quoteRef.current, { duration: 0.9 }, quoteRef.current);

      gsap.fromTo(headerRef.current?.querySelectorAll("[data-anim]") || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true } }
      );

      gsap.fromTo(cardsRef.current?.querySelectorAll(".svc-card") || [],
        { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: "power4.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true } }
      );
    });
  }, []);

  const openChat = () => document.querySelector<HTMLButtonElement>("[data-chatbot-trigger]")?.click();

  return (
    <section ref={sectionRef} id="services" className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="divider" />
      <div className="max-w-6xl mx-auto">
        <div ref={quoteRef} className="py-20 sm:py-24 text-center opacity-0">
          <p className="font-display font-700 text-[clamp(1.4rem,3.5vw,2.8rem)] tracking-tight text-text-secondary max-w-3xl mx-auto leading-[1.3]">
            "Every pixel is intentional. Every line of code is clean. Every deadline is real."
          </p>
          <span className="text-text-muted text-sm mt-4 block font-mono">— Bilal, Founder of W-Agency</span>
        </div>
        <div className="divider mb-16 sm:mb-24" />

        <div ref={headerRef} className="mb-12 sm:mb-16">
          <span data-anim className="font-mono text-accent text-xs sm:text-sm tracking-widest uppercase opacity-0">Pricing</span>
          <h2 data-anim className="font-display font-800 text-[clamp(2rem,5vw,4rem)] tracking-tight mt-2 opacity-0">
            Clear pricing.<br /><span className="text-text-secondary">No surprises.</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((svc, i) => (
            <div key={i} className="svc-card opacity-0 glass rounded-2xl p-6 sm:p-8 border border-border-subtle hover:border-border-accent transition-all duration-500 group flex flex-col">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl glass-accent flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                {svc.icon}
              </div>
              <h3 className="font-display font-700 text-lg sm:text-xl mb-2">{svc.title}</h3>
              <div className="font-display font-800 text-xl sm:text-2xl gradient-text-accent mb-4">{svc.price}</div>
              <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">{svc.description}</p>
              <ul className="space-y-2 mb-6">
                {svc.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <button onClick={openChat} className="w-full btn-ghost text-sm py-3 mt-auto">Start This Project</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
