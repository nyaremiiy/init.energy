import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "primaryOnLight"
  | "secondaryOnLight";
type ButtonSize = "default" | "wide" | "compact";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-slate-950 hover:bg-white/90 focus-visible:outline-white",
  secondary:
    "border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white/10 focus-visible:outline-white",
  primaryOnLight: "bg-ink text-white hover:bg-ink/85 focus-visible:outline-ink",
  secondaryOnLight:
    "border border-ink/20 text-ink hover:border-ink hover:bg-white focus-visible:outline-ink",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-12 px-6 sm:px-7",
  wide: "min-h-12 px-7 sm:px-9",
  compact: "min-h-10 px-5",
};

export function Button({
  className,
  href,
  icon,
  size = "default",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:-translate-y-0.5 ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`;
  const content = (
    <>
      {children}
      {icon ? (
        <span className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}
