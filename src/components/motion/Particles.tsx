"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number };

/**
 * Slow golden dust rising through the light of the crown.
 * One canvas, a few dozen dots; the loop pauses off-screen, in hidden tabs
 * and is skipped entirely with reduced motion.
 */
export function Particles({ className, count = 42, rgb = "243, 217, 160" }: { className?: string; count?: number; /** Dot colour as "r, g, b". */ rgb?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const small = window.matchMedia("(max-width: 640px)").matches;
    const total = small ? Math.round(count * 0.4) : count;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const spawn = (anyY: boolean): Dot => ({
      x: w * (0.15 + Math.random() * 0.7),
      y: anyY ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.6,
      vy: 6 + Math.random() * 14,
      vx: (Math.random() - 0.5) * 4,
      a: 0.25 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = Array.from({ length: total }, () => spawn(true));
    };

    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.vy * dt;
        d.x += d.vx * dt;
        d.tw += dt * 1.6;
        if (d.y < -10) Object.assign(d, spawn(false));
        // Fade out towards the top so dots dissolve rather than pop.
        const life = Math.min(1, d.y / (h * 0.5));
        const alpha = d.a * life * (0.65 + 0.35 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, reduce, rgb]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
