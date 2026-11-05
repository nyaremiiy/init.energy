import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-slate-950 hover:bg-white/90",
  secondary:
    "border border-white/40 text-white hover:border-white hover:bg-white/10",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors sm:px-7 ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
