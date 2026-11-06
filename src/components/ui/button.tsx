import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "dark";
type ButtonSize = "default" | "wide" | "form";

type SharedButtonProps = {
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
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
  primary:
    "bg-white text-ink hover:bg-white/90 focus-visible:outline-white",
  secondary:
    "border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white/10 focus-visible:outline-white",
  dark: "bg-ink text-white hover:opacity-90 focus-visible:outline-ink",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-12 px-6 sm:px-7",
  wide: "min-h-12 px-7 sm:px-9",
  form: "h-14 w-full px-6 text-base",
};

export function Button(props: ButtonProps) {
  const {
    className,
    icon,
    size = "default",
    variant = "primary",
    children,
    ...elementProps
  } = props;
  const classes = `group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-heading text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`;
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

  if ("href" in elementProps && elementProps.href) {
    const { href, ...linkProps } = elementProps;

    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...linkProps}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...linkProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } =
    elementProps as ComponentPropsWithoutRef<"button">;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
