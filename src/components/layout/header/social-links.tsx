import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";

import { socialLinks, type SocialNetwork } from "./header-data";

const icons: Record<SocialNetwork, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
};

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

export function SocialLinks({
  className,
  iconClassName = "size-4",
}: SocialLinksProps) {
  return (
    <ul aria-label="Соціальні мережі" className={`flex items-center gap-3 ${className ?? ""}`}>
      {socialLinks.map((link) => {
        const SocialIcon = icons[link.network];

        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex text-white/80 transition-colors hover:text-white"
            >
              <SocialIcon className={iconClassName} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
