"use client";
import dynamic from "next/dynamic";

const Hero      = dynamic(() => import("@/components/Hero"),       { ssr: false });
const Projects  = dynamic(() => import("@/components/Projects"),   { ssr: false });
const Services  = dynamic(() => import("@/components/Services"),   { ssr: false });
const About     = dynamic(() => import("@/components/About"),      { ssr: false });
const ChatBot   = dynamic(() => import("@/components/ChatBot"),    { ssr: false });
const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });

export default function ClientSections() {
  return (
    <>
      <CursorGlow />
      <Hero />
      <Projects />
      <Services />
      <About />
      <ChatBot />
    </>
  );
}
