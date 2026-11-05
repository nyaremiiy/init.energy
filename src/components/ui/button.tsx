import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-slate-950 hover:bg-white/90",
  secondary:
    "border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white/10",
};

export function Button({
  className,
  icon,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 sm:px-7 ${variantClasses[variant]} ${className ?? ""}`}
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
