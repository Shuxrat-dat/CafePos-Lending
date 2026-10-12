"use client";

import { Reveal, RevealText } from "./Reveal";

/**
 * Section opening in the YURTORA style: a large headline whose words rise in
 * sequence, with the supporting line arriving just after. Left-aligned by
 * default so sections don't all stack on the centre axis.
 */
export function SectionHeader({
  title,
  lead,
  align = "left",
  className,
}: {
  title: string;
  lead?: string;
  align?: "left" | "center" | "split";
  className?: string;
}) {
  if (align === "split") {
    return (
      <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className ?? ""}`}>
        <RevealText text={title} className="font-display text-[clamp(2rem,4.8vw,3.8rem)] font-medium leading-[1.05] display-tight lg:col-span-7" />
        {lead && (
          <Reveal as="p" delay={250} className="max-w-md text-lg leading-relaxed text-mist lg:col-span-5 lg:justify-self-end">
            {lead}
          </Reveal>
        )}
      </div>
    );
  }
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className ?? ""}`}>
      <RevealText text={title} className="font-display text-[clamp(2rem,4.8vw,3.8rem)] font-medium leading-[1.05] display-tight" />
      {lead && (
        <Reveal as="p" delay={250} className={`mt-5 text-lg leading-relaxed text-mist ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}
