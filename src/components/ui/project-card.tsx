import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";
import { products } from "@/content/products";
import { slugs, toPath } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { format, messages } from "@/lib/messages";

import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";
import { IconButton } from "./icon-button";
import { MediaPlaceholder } from "./media-placeholder";

type ProjectCardProps = {
  project: Project;
  variant: "large" | "small";
};

/**
 * Project case. With a photo: image, dark gradient and white text on top.
 * Without a photo: a light `surface` card with a placeholder and muted text —
 * no black card.
 */
export function ProjectCard({ project, variant }: ProjectCardProps) {
  const t = messages.projects;
  const equipment = products[project.equipment];
  const isLarge = variant === "large";
  const hasPhoto = Boolean(project.image);
  const projectHref = toPath(slugs.projects, project.slug);
  const title = `${project.title} · ${project.city}${isLarge ? `, ${project.region}` : ""}`;

  const tone = hasPhoto
    ? {
        card: "bg-ink text-white",
        title: "text-white",
        muted: "text-white/75",
        divider: "border-white/25",
        link: "decoration-white/35 hover:decoration-white focus-visible:outline-white",
        eyebrow: "dark" as const,
        button: "outline-dark" as const,
      }
    : {
        card: "bg-surface text-ink",
        title: "text-ink",
        muted: "text-ink/70",
        divider: "border-line",
        link: "decoration-ink/30 hover:decoration-ink focus-visible:outline-ink",
        eyebrow: "light" as const,
        button: "outline-light" as const,
      };

  const specs = [
    {
      label: t.fields.power,
      value: formatQuantity({ value: project.powerKw, unit: "kW" }),
    },
    {
      label: t.fields.storage,
      value: (
        <Link
          href={equipment.href}
          className={`underline underline-offset-4 transition-colors duration-150 ease-tech focus-visible:outline-2 focus-visible:outline-offset-2 ${tone.link}`}
        >
          {equipment.name}
        </Link>
      ),
    },
    ...(isLarge ? [{ label: t.fields.region, value: project.region }] : []),
    { label: t.fields.year, value: String(project.year) },
  ];

  return (
    <article
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-3xl shadow-soft ${tone.card}`}
    >
      {project.image ? (
        <>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            quality={90}
            sizes={
              isLarge
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 1024px) 42vw, 100vw"
            }
            className="object-cover transition-transform duration-500 ease-tech motion-safe:group-hover:scale-103"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/0"
          />
        </>
      ) : (
        <div className="min-h-0 flex-1 p-3 pb-0">
          <MediaPlaceholder
            caption={t.imagePending}
            className="size-full rounded-2xl"
          />
        </div>
      )}

      <div
        className={`relative flex flex-col p-6 sm:p-8 ${hasPhoto ? "mt-auto" : ""}`}
      >
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            <Eyebrow tone={tone.eyebrow}>{t.segments[project.segment]}</Eyebrow>
            <Heading as="h3" size="h3" className={tone.title}>
              {title}
            </Heading>
          </div>
          <IconButton
            href={projectHref}
            aria-label={format(t.details, { title })}
            variant={tone.button}
          />
        </div>

        <dl
          className={`mt-6 grid border-t pt-4 text-base ${tone.divider} ${
            isLarge ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
          }`}
        >
          {specs.map((spec) => (
            <div key={spec.label} className="min-w-0 pr-3 last:pr-0">
              <dt className={`text-sm ${tone.muted}`}>{spec.label}</dt>
              <dd className="mt-1 truncate font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
