import Link from "next/link";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function NavLink({ href, ...props }: NavLinkProps) {
  if (href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} {...props} />;
}
