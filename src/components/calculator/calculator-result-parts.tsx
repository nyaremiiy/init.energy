import Image from "next/image";
import Link from "next/link";

import { IconButton } from "@/components/ui/icon-button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";

/** Parts of the dark result card shared by every calculator on the site. */

export function ResultLink({
  href,
  title,
  text,
  kind,
}: {
  href: string;
  title: string;
  text: string;
  kind: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-t border-line-dark py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body font-medium text-white">{title}</span>
        <span className="text-small text-muted-dark">{text}</span>
      </span>
      <span className="text-small text-muted-dark">{kind}</span>
      <IconButton decorative variant="outline-dark" size="sm" />
    </Link>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse gap-1 border-t border-line-dark pt-4">
      <dt className="text-small text-muted-dark">{label}</dt>
      <dd className="font-heading text-stat-sm font-medium whitespace-nowrap tabular-nums sm:text-stat">
        {value}
      </dd>
    </div>
  );
}

/** Recommended product on the dark result card: photo, name, capacity and an arrow. */
export function ProductLink({
  href,
  image,
  kind,
  title,
  text,
  label,
}: {
  href: string;
  image?: { src: string };
  kind: string;
  title: string;
  text: string;
  /** Accessible name of the link, e.g. «Детальніше про SVIT HOME». */
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group flex items-center gap-4 rounded-tile bg-fill-dark p-3 transition-colors duration-200 ease-tech hover:bg-line-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {image ? (
        <span className="relative size-16 shrink-0 overflow-hidden rounded-tile bg-white">
          <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
        </span>
      ) : (
        <MediaPlaceholder caption="" tone="dark" className="size-16 shrink-0 rounded-tile" />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-small text-muted-dark">{kind}</span>
        <span className="font-heading text-body font-semibold text-white">{title}</span>
        <span className="text-small text-muted-dark">{text}</span>
      </span>
      <IconButton decorative variant="outline-dark" size="sm" />
    </Link>
  );
}
