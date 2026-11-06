import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "wide";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-slate-950 hover:bg-white/90",
  secondary:
    "border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-6 sm:px-7",
  wide: "px-7 sm:px-9",
};

export function Button({
  className,
  icon,
  size = "default",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
      {icon ? (
        <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </a>
  );
}
