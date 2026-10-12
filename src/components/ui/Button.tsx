import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "ghost";
type Size = "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Adds a trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

/**
 * The one button of the site. Gold = primary action, ghost = secondary.
 * Hover: light sheen sweeps across (gold) or a soft fill fades in (ghost);
 * press: scales to 0.97. Renders a Next <Link> when `href` is given.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = "gold", size = "md", arrow, className, children } = props;
  const cls = `btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className ?? ""}`;
  const content = (
    <>
      <span className="btn-label">{children}</span>
      {arrow && <ArrowRight className="btn-icon size-4" aria-hidden />}
    </>
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props;
    return (
      <Link {...rest} className={cls}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button {...rest} type={type} className={cls}>
      {content}
    </button>
  );
}
