import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://w-agency-portfolio.vercel.app"),
  title: {
    default: "W-Agency | Premium Web Design & AI Development",
    template: "%s | W-Agency",
  },
  description: "W-Agency crafts high-performance websites, AI-integrated platforms, and premium digital experiences. From $100 landing pages to $500 AI-powered SaaS products.",
  keywords: ["web design agency","web development","AI web development","premium web design","landing page design","full-stack development","Next.js developer","SaaS development","UI/UX design","web designer for hire","affordable web design","modern website design","animated website","glassmorphism design","W-Agency"],
  authors: [{ name: "Bilal", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "W-Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "W-Agency",
    title: "W-Agency | Premium Web Design & AI Development",
    description: "We build high-performance websites and AI-integrated platforms that convert. Starting at $100.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "W-Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "W-Agency | Premium Web Design & AI Development",
    description: "We build high-performance websites and AI-integrated platforms that convert.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "ProfessionalService",
          "name": "W-Agency", "description": "Premium web design and AI development agency",
          "url": process.env.NEXT_PUBLIC_SITE_URL, "priceRange": "$100 - $500+",
          "serviceType": "Web Design and Development", "areaServed": "Worldwide",
        })}} />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif" }}>{children}</body>
    </html>
  );
}
