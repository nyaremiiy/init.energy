import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type IconButtonVariant = "outline-light" | "outline-dark" | "solid-light";
type IconButtonSize = "md" | "sm";

type SharedProps = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Shows a spinner instead of the arrow (e.g. while a form is sending). */
  loading?: boolean;
  className?: string;
};

type LinkProps = SharedProps & { href: string; "aria-label": string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "children" | "className"
  >;
type ButtonProps = SharedProps & { href?: never; "aria-label": string } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "className"
  >;
/** Decorative arrow inside a larger link (the parent is the interactive element). */
type DecorativeProps = SharedProps & { decorative: true };

type IconButtonProps = LinkProps | ButtonProps | DecorativeProps;

const variantClasses: Record<IconButtonVariant, string> = {
  /** On light backgrounds. */
  "outline-light":
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white group-hover:border-ink group-hover:bg-ink group-hover:text-white focus-visible:outline-ink",
  /** On dark backgrounds or photos — lightens on hover. */
  "outline-dark":
    "border border-white/45 text-white hover:border-white hover:bg-white/15 group-hover:border-white group-hover:bg-white/15 focus-visible:outline-white",
  /** Filled white (e.g. the newsletter submit). */
  "solid-light":
    "bg-white text-ink hover:bg-white/90 focus-visible:outline-white",
};

const sizeClasses: Record<IconButtonSize, string> = {
  md: "size-12",
  sm: "size-11",
};

/** Round button/link with the site's only arrow, ArrowUpRight (18px). */
export function IconButton(props: IconButtonProps) {
  const {
    variant = "outline-light",
    size = "md",
    loading = false,
    className,
  } = props;
  const classes = `group/icon inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`;
  const icon = loading ? (
    <Loader2 aria-hidden className="size-4.5 motion-safe:animate-spin" />
  ) : (
    <ArrowUpRight
      aria-hidden
      className="size-4.5 transition-transform duration-150 ease-tech motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover/icon:translate-x-0.5 motion-safe:group-hover/icon:-translate-y-0.5"
    />
  );

  if ("decorative" in props) {
    return (
      <span aria-hidden className={classes}>
        {icon}
      </span>
    );
  }

  if ("href" in props && props.href) {
    const {
      href,
      variant: _v,
      size: _s,
      loading: _l,
      className: _c,
      ...linkProps
    } = props;
    void _v;
    void _s;
    void _l;
    void _c;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {icon}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    className: _c,
    type = "button",
    ...buttonProps
  } = props as ButtonProps;
  void _v;
  void _s;
  void _l;
  void _c;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {icon}
    </button>
  );
}
