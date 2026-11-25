"use client";

import {
  socialLinks,
  type SocialNetwork,
} from "@/components/layout/header/header-data";
import { useMessages } from "@/i18n/client";
import { format } from "@/lib/messages";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "./social-icons";

const icons: Record<SocialNetwork, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
};

type SocialLinksProps = {
  /** "inline" — bare icons (header top bar, mobile menu); "circle" — 44px outlined circles (footer). */
  variant?: "inline" | "circle";
  /** Icon size class; defaults to 16px inline, 18px in circles. */
  iconClassName?: string;
  /** "dark" on dark backgrounds (default); "light" on white (mobile menu). Inline variant only. */
  tone?: "dark" | "light";
  className?: string;
};

const linkClasses = {
  inline:
    "inline-flex rounded-sm text-muted-dark transition-colors duration-150 ease-tech hover:text-white",
  inlineLight:
    "inline-flex rounded-sm text-muted transition-colors duration-150 ease-tech hover:text-ink",
  circle:
    "inline-flex size-11 items-center justify-center rounded-full border border-faint-dark text-muted-dark transition-colors duration-150 ease-tech hover:border-white hover:text-white",
};

/** One set of line-style social icons for the header and the footer. */
export function SocialLinks({
  variant = "inline",
  iconClassName,
  tone = "dark",
  className,
}: SocialLinksProps) {
  const light = tone === "light" && variant === "inline";
  const t = useMessages().footer;

  return (
    <ul
      aria-label={t.socialNavLabel}
      className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}
    >
      {socialLinks.map((link) => {
        const Icon = icons[link.network];

        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener"
              aria-label={format(t.socialLabel, { network: link.label })}
              className={`${light ? linkClasses.inlineLight : linkClasses[variant]} focus-visible:outline-2 focus-visible:outline-offset-2 ${light ? "focus-visible:outline-ink" : "focus-visible:outline-white"}`}
            >
              <Icon
                className={
                  iconClassName ??
                  (variant === "circle" ? "size-4.5" : "size-4")
                }
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
