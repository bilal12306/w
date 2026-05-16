"use client";
import { useState, useRef, useEffect } from "react";
import { loadGSAP } from "@/hooks/useGSAP";

const projects = [
  {
    id: 1, title: "FoodBrew", category: "Food & Beverage",
    description: "Full-featured restaurant landing page with rich animations, mobile-first layout, and conversion-optimized design.",
    url: "https://my-food-brew-1cxh.vercel.app/",
    price: 200, tags: ["Landing Page", "Animation", "UI/UX"], color: "#FF6B35",
  },
  {
    id: 2, title: "DemoTest", category: "Startup / SaaS",
    description: "Clean, component-driven frontend showcasing modern architecture and sleek UI patterns.",
    url: "https://demotest-68rg.vercel.app/",
    price: 100, tags: ["Frontend", "Startup", "Modern"], color: "#00D4FF",
  },
  {
    id: 3, title: "Claude One", category: "AI Platform",
    description: "Premium AI-integrated web platform with intelligent real-time responses and next-generation UX.",
    url: "https://claude-one-black.vercel.app/",
    price: 500, tags: ["AI Integration", "Full-Stack", "Premium"], color: "#5E4BF0", featured: true,
  },
];

export default function Projects() {
  const [activePreview, setActivePreview] = useState<number | null>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      gsap.fromTo(headerRef.current?.querySelectorAll("[data-anim]") || [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power4.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true } }
      );
      const cards = cardsRef.current?.querySelectorAll(".project-card") || [];
      gsap.fromTo(cards,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: "power4.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true } }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span data-anim className="font-mono text-accent text-xs sm:text-sm tracking-widest uppercase opacity-0">Our Work</span>
            <h2 data-anim className="font-display font-800 text-[clamp(2rem,5vw,4rem)] tracking-tight mt-2 opacity-0">
              Built to Perform.<br /><span className="text-text-secondary">Priced Fairly.</span>
            </h2>
          </div>
          <p data-anim className="text-text-secondary max-w-xs text-sm sm:text-base leading-relaxed opacity-0">
            Every project is fully deployed and production-grade. Click to preview live.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onPreview={() => { setActivePreview(project.id); setFrameLoaded(false); }} />
          ))}
        </div>
      </div>

      {activePreview && (
        <PreviewModal
          project={projects.find((p) => p.id === activePreview)!}
          frameLoaded={frameLoaded}
          onLoaded={() => setFrameLoaded(true)}
          onClose={() => setActivePreview(null)}
        />
      )}
    </section>
  );
}

function ProjectCard({ project, onPreview }: { project: typeof projects[0]; onPreview: () => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGSAP().then(({ gsap }) => {
      if (!cardRef.current) return;
      cardRef.current.addEventListener("mouseenter", () => {
        gsap.to(cardRef.current, { y: -6, duration: 0.4, ease: "power2.out" });
      });
      cardRef.current.addEventListener("mouseleave", () => {
        gsap.to(cardRef.current, { y: 0, duration: 0.5, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`project-card opacity-0 relative rounded-2xl overflow-hidden border cursor-pointer transition-colors duration-300 ${
        project.featured ? "border-accent/30 sm:col-span-2 lg:col-span-1" : "border-border-subtle hover:border-border-accent"
      }`}
      style={{ background: hovered ? `${project.color}0D` : "rgba(13,13,20,0.7)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPreview}
    >
      {project.featured && (
        <div className="absolute top-3 right-3 z-10"><span className="tag text-xs">✦ Featured</span></div>
      )}
      <div className="relative h-44 sm:h-52 overflow-hidden border-b border-border-subtle bg-void-3">
        <iframe
          src={project.url}
          className="w-full h-full pointer-events-none border-0"
          style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "167%", height: "167%" }}
          loading="lazy" title={`${project.title} preview`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void/70" />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="btn-primary text-sm py-2.5 px-5 pointer-events-none">
            Live Preview ↗
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs text-text-muted font-mono uppercase tracking-widest">{project.category}</span>
            <h3 className="font-display font-700 text-lg sm:text-xl mt-0.5">{project.title}</h3>
          </div>
          <div className="price-badge text-base sm:text-lg shrink-0">${project.price}</div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.tags.map((tag) => <span key={tag} className="tag text-[10px] sm:text-xs">{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ project, frameLoaded, onLoaded, onClose }: {
  project: typeof projects[0]; frameLoaded: boolean; onLoaded: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-void/95 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-6xl h-[88vh] sm:h-[85vh] glass rounded-xl sm:rounded-2xl border border-border-subtle overflow-hidden"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="font-mono text-xs sm:text-sm text-text-muted truncate">{project.url}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex btn-ghost text-xs py-1.5 px-3" onClick={(e) => e.stopPropagation()}>
              Open Live ↗
            </a>
            <button onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg glass border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary text-lg">
              ×
            </button>
          </div>
        </div>
        <div className="relative w-full" style={{ height: "calc(100% - 57px)" }}>
          {!frameLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-void gap-4">
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderColor: "rgba(94,75,240,0.3)", borderTopColor: "#5E4BF0" }} />
              <span className="text-sm text-text-muted">Loading {project.title}...</span>
            </div>
          )}
          <iframe src={project.url} className="w-full h-full border-0" onLoad={onLoaded} title={`${project.title} preview`} />
        </div>
      </div>
    </div>
  );
}
