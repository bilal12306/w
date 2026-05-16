"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0, y = 0;
    let cx = 0, cy = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      glow.style.left = `${cx}px`;
      glow.style.top = `${cy}px`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      style={{
        position: "fixed",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(94,75,240,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
        transform: "translate(-50%, -50%)",
        transition: "none",
      }}
    />
  );
}
