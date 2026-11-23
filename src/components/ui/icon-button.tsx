import { ArrowUpRight, Loader2, Menu, Pause, Phone, Play, X } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type IconButtonVariant = "outline-light" | "outline-dark" | "solid-light" | "solid-dark";
type IconButtonSize = "md" | "sm";
type IconButtonIcon = "arrow" | "close" | "menu" | "phone" | "pause" | "play";

type SharedProps = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Glyph inside the circle. Only the arrow moves on hover. */
  icon?: IconButtonIcon;
  /** Shows a spinner instead of the glyph (e.g. while a form is sending). */
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
/** Decorative glyph inside a larger link (the parent is the interactive element). */
type DecorativeProps = SharedProps & { decorative: true };

type IconButtonProps = LinkProps | ButtonProps | DecorativeProps;

const variantClasses: Record<IconButtonVariant, string> = {
  /** On light backgrounds. */
  "outline-light":
    "border border-line text-ink hover:border-ink hover:bg-ink hover:text-white group-hover:border-ink group-hover:bg-ink group-hover:text-white focus-visible:outline-ink",
  /** On dark backgrounds or photos — lightens on hover. */
  "outline-dark":
    "border border-faint-dark text-white hover:border-white hover:bg-line-dark group-hover:border-white group-hover:bg-line-dark focus-visible:outline-white",
  /** Filled white (e.g. the contact phone). */
  "solid-light": "bg-white text-ink hover:bg-surface focus-visible:outline-white",
  "solid-dark": "bg-ink text-white hover:bg-navy focus-visible:outline-ink",
};

const sizeClasses: Record<IconButtonSize, string> = {
  md: "size-12",
  sm: "size-11",
};

/** Round button or link with one 18px glyph (arrow by default). */
export function IconButton(props: IconButtonProps) {
  const {
    variant = "outline-light",
    size = "md",
    icon = "arrow",
    loading = false,
    className,
  } = props;

  const classes = `group/icon inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`;

  const glyphProps = { "aria-hidden": true as const, size: 18, strokeWidth: 1.7 };
  const arrowMove =
    "transition-transform duration-150 ease-tech motion-safe:group-hover/icon:translate-x-0.5 motion-safe:group-hover/icon:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5";
  const glyph = loading ? (
    <Loader2 {...glyphProps} className="motion-safe:animate-spin" />
  ) : icon === "close" ? (
    <X {...glyphProps} />
  ) : icon === "menu" ? (
    <Menu {...glyphProps} />
  ) : icon === "phone" ? (
    <Phone {...glyphProps} />
  ) : icon === "pause" ? (
    <Pause {...glyphProps} />
  ) : icon === "play" ? (
    <Play {...glyphProps} />
  ) : (
    <ArrowUpRight {...glyphProps} className={arrowMove} />
  );

  if ("decorative" in props) {
    return (
      <span aria-hidden className={classes}>
        {glyph}
      </span>
    );
  }

  if ("href" in props && props.href) {
    const {
      href,
      variant: _v,
      size: _s,
      icon: _i,
      loading: _l,
      className: _c,
      ...linkProps
    } = props;
    void _v;
    void _s;
    void _i;
    void _l;
    void _c;

    return (
      <Link href={href} className={classes} aria-busy={loading || undefined} {...linkProps}>
        {glyph}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    loading: _l,
    className: _c,
    type = "button",
    ...buttonProps
  } = props as ButtonProps;
  void _v;
  void _s;
  void _i;
  void _l;
  void _c;

  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      {...buttonProps}
      disabled={loading || buttonProps.disabled}
    >
      {glyph}
    </button>
  );
}
