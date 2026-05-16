import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-border-subtle py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-800 text-white text-sm">
                W
              </div>
              <span className="font-display font-700 text-lg">W-Agency</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Premium web design and AI development. Built to convert, designed to last.
            </p>
          </div>

          <div>
            <h4 className="font-display font-600 text-sm text-text-muted uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "#projects", label: "Work" },
                { href: "#services", label: "Services" },
                { href: "#about", label: "About" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-600 text-sm text-text-muted uppercase tracking-widest mb-4">Get Started</h4>
            <p className="text-text-secondary text-sm mb-4">
              Ready to build something real? Create an account and talk to our AI to get an instant quote.
            </p>
            <Link href="/auth/signup" className="btn-primary text-sm py-2.5 px-5">
              Start a Project
            </Link>
          </div>
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} W-Agency. All rights reserved.
          </p>
          <p className="text-text-muted text-sm font-mono">
            Built with Next.js 15 + Supabase + Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
