"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useHydrated, useMediaQuery } from "@/lib/hooks";
import { modalBackdrop, modalPanel } from "@/lib/motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: bottom sheet on phones, centred panel on larger screens.
 * Escape closes, focus is trapped inside and returned to the trigger on close.
 */
export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  header,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  header?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusFirst = window.setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 30);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,rgb(14_20_36/0.2),rgb(14_20_36/0.45))] backdrop-blur-[6px]"
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            variants={modalPanel(isDesktop, !!reduce)}
            initial="hidden"
            animate="show"
            exit="exit"
            className="glass relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] outline-none sm:max-w-lg sm:rounded-[28px]"
            style={{ background: "linear-gradient(180deg, rgb(255 255 255 / 0.98), rgb(246 247 250 / 0.98))" }}
          >
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-paper/15 sm:hidden" aria-hidden />
            <div className="flex items-start justify-between gap-4 px-6 pt-5 sm:px-8 sm:pt-7">
              <div className="min-w-0">
                {header}
                <h2 id={titleId} className="font-display text-xl font-medium leading-tight text-paper">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-mist transition-colors duration-200 hover:bg-paper/5 hover:text-paper active:scale-[0.96]"
                aria-label={closeLabel}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
