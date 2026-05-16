"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loadGSAP } from "@/hooks/useGSAP";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadGSAP().then(({ gsap }) => {
      gsap.fromTo(navRef.current?.querySelectorAll("[data-nav]") || [],
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.3 }
      );
    });
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    loadGSAP().then(({ gsap }) => {
      if (!menuRef.current) return;
      const items = menuRef.current.querySelectorAll("[data-menu-item]");
      if (menuOpen) {
        gsap.to(menuRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
        gsap.fromTo(items, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" });
      } else {
        gsap.to(menuRef.current, { opacity: 0, pointerEvents: "none", duration: 0.25 });
      }
    });
    // Lock body scroll on mobile menu
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 glass border-b border-border-subtle" : "py-5 sm:py-6 bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between">
          <Link data-nav href="/" className="opacity-0 flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent flex items-center justify-center font-display font-800 text-white text-xs sm:text-sm transition-transform group-hover:scale-110">
              W
            </div>
            <span className="font-display font-700 text-base sm:text-lg tracking-tight">
              W<span className="text-accent">-</span>Agency
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[{ href: "#projects", label: "Work" }, { href: "#services", label: "Services" }, { href: "#about", label: "About" }].map(({ href, label }) => (
              <a key={href} data-nav href={href} className="opacity-0 text-text-secondary hover:text-text-primary text-sm font-500 transition-colors relative group">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link data-nav href="/messages" className="opacity-0 text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2">My Project</Link>
                <button data-nav onClick={handleSignOut} className="opacity-0 text-sm text-text-muted hover:text-text-secondary transition-colors px-3 py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link data-nav href="/auth/login" className="opacity-0 btn-ghost text-sm py-2 px-4">Sign In</Link>
                <Link data-nav href="/auth/signup" className="opacity-0 btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] relative z-[60]"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-[1.5px] bg-text-primary transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-text-primary transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-text-primary transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div ref={menuRef} className="fixed inset-0 z-40 bg-void/98 backdrop-blur-2xl opacity-0 pointer-events-none flex flex-col items-center justify-center gap-6 px-6">
        {[{ href: "#projects", label: "Work" }, { href: "#services", label: "Services" }, { href: "#about", label: "About" }].map(({ href, label }) => (
          <a key={href} data-menu-item href={href} onClick={() => setMenuOpen(false)}
            className="font-display font-800 text-[clamp(2.5rem,10vw,4rem)] text-text-primary hover:text-accent transition-colors opacity-0">
            {label}
          </a>
        ))}
        <div data-menu-item className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-xs opacity-0">
          {user ? (
            <>
              <Link href="/messages" onClick={() => setMenuOpen(false)} className="btn-primary justify-center flex-1">My Project</Link>
              <button onClick={() => { setMenuOpen(false); handleSignOut(); }} className="btn-ghost justify-center flex-1">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="btn-primary justify-center flex-1">Get Started</Link>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-ghost justify-center flex-1">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
