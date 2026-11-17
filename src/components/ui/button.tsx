import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "dark" | "outline-light";
type ButtonSize = "md" | "sm";

type SharedButtonProps = {
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Full container width (mobile forms, banners). */
  fullWidth?: boolean;
  /** Spinner instead of the icon; the button is disabled while busy. */
  loading?: boolean;
};

type ButtonLinkProps = SharedButtonProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    href: string;
  };

type ButtonElementProps = SharedButtonProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: never;
  };

type ButtonProps = ButtonLinkProps | ButtonElementProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-ink hover:bg-surface focus-visible:outline-white",
  secondary:
    "border border-faint-dark text-white backdrop-blur-sm hover:border-white hover:bg-fill-dark focus-visible:outline-white",
  /** Main action on light backgrounds (forms). */
  dark: "bg-ink text-white hover:bg-navy focus-visible:outline-faint",
  "outline-light":
    "border border-faint text-ink hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-faint",
};

/** md: main size (48 px). sm: 40 px, desktop banners and dialogs only. */
const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 sm:px-7",
  sm: "min-h-10 px-5 text-caption",
};

export function Button(props: ButtonProps) {
  const {
    className,
    icon,
    size = "md",
    variant = "primary",
    fullWidth = false,
    loading = false,
    children,
    ...elementProps
  } = props;
  const classes = `group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-heading text-small font-semibold transition duration-200 focus-visible:outline-4 focus-visible:outline-offset-2 motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${fullWidth ? "w-full" : ""} ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`;
  const content = (
    <>
      {children}
      {loading ? (
        <Loader2 aria-hidden className="size-4.5 motion-safe:animate-spin" />
      ) : icon ? (
        <span className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if ("href" in elementProps && elementProps.href) {
    const { href, ...linkProps } = elementProps;

    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} aria-busy={loading || undefined} {...linkProps}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...linkProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } =
    elementProps as ComponentPropsWithoutRef<"button">;

  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      {...buttonProps}
      disabled={loading || buttonProps.disabled}
    >
      {content}
    </button>
  );
}
