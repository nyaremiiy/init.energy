import {
  socialLinks,
  type SocialNetwork,
} from "@/components/layout/header/header-data";
import { format, messages } from "@/lib/messages";

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
  className?: string;
};

const linkClasses = {
  inline:
    "inline-flex rounded-sm text-white/80 transition-colors duration-150 ease-tech hover:text-white",
  circle:
    "inline-flex size-11 items-center justify-center rounded-full border border-white/22 text-white/80 transition-colors duration-150 ease-tech hover:border-white/60 hover:bg-white/8 hover:text-white",
};

/** One set of line-style social icons for the header and the footer. */
export function SocialLinks({
  variant = "inline",
  iconClassName,
  className,
}: SocialLinksProps) {
  const t = messages.footer;

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
              className={`${linkClasses[variant]} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
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
