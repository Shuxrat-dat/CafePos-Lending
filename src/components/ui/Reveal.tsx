"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  // Content is only hidden once this runs, so a JS failure never hides anything.
  document.documentElement.classList.add("reveal-ready");
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-shown", "");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
  );
  return observer;
}

/** Registers an element with the shared reveal observer. Revealed once, then left alone. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.hasAttribute("data-shown")) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

export type RevealVariant = "fade" | "scale" | "clip" | "lines" | "draw" | "stage";

type RevealProps = {
  as?: ElementType;
  /** fade (default) · scale · clip (mask window) · draw (SVG .draw-path children) · stage (choreograph .rv children) */
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  "aria-hidden"?: boolean;
};

/** Scroll-triggered entrance driven by CSS (see globals.css → "Scroll reveal"). */
export function Reveal({ as: Tag = "div", variant = "fade", delay = 0, className, style, children, id, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant}
      className={className}
      aria-hidden={rest["aria-hidden"]}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline whose words rise out of a clipped baseline in sequence.
 * Words wrap naturally at any width; screen readers read the plain sentence.
 */
export function RevealText({
  as: Tag = "h2",
  text,
  className,
  delay = 0,
  wordClassName,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  /** Optional per-word class, e.g. to tint the last words. */
  wordClassName?: (index: number, total: number) => string | undefined;
}) {
  const ref = useReveal<HTMLElement>();
  const words = text.split(" ");
  return (
    <Tag
      ref={ref}
      data-reveal="lines"
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="rt-word">
            <span className={wordClassName?.(i, words.length)} style={{ "--w": i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
