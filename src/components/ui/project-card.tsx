import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";
import { products } from "@/content/products";
import { slugs, toPath } from "@/content/routes";
import { formatQuantity } from "@/lib/format";
import { format, messages } from "@/lib/messages";

import { Heading } from "./heading";
import { Label } from "./label";
import { MediaPlaceholder } from "./media-placeholder";

type ProjectCardProps = {
  project: Project;
  variant: "large" | "small";
};

export function ProjectCard({ project, variant }: ProjectCardProps) {
  const t = messages.projects;
  const equipment = products[project.equipment];
  const isLarge = variant === "large";
  const projectHref = toPath(slugs.projects, project.slug);
  const title = `${project.title} · ${project.city}${isLarge ? `, ${project.region}` : ""}`;
  const specs = [
    { label: t.fields.power, value: formatQuantity({ value: project.powerKw, unit: "kW" }) },
    {
      label: t.fields.storage,
      value: (
        <Link
          href={equipment.href}
          className="underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {equipment.name}
        </Link>
      ),
    },
    ...(isLarge ? [{ label: t.fields.region, value: project.region }] : []),
    { label: t.fields.year, value: String(project.year) },
  ];

  return (
    <article className="group relative isolate h-full overflow-hidden rounded-3xl bg-ink text-white">
      {project.image ? (
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
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      ) : (
        <MediaPlaceholder
          tone="dark"
          caption=""
          className="absolute inset-0 size-full rounded-none"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/72 to-ink/0"
      />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            <Label tone="onDark">{t.segments[project.segment]}</Label>
            <Heading
              as="h3"
              className={
                isLarge
                  ? "text-3xl leading-tight text-white sm:text-4xl"
                  : "text-2xl leading-tight text-white sm:text-3xl"
              }
            >
              {title}
            </Heading>
          </div>
          <Link
            href={projectHref}
            aria-label={format(t.details, { title })}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowUpRight aria-hidden className="size-5" />
          </Link>
        </div>

        <dl
          className={`mt-6 grid border-t border-white/25 pt-4 text-sm sm:text-base ${
            isLarge ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
          }`}
        >
          {specs.map((spec) => (
            <div key={spec.label} className="min-w-0 pr-3 last:pr-0">
              <dt className="text-xs text-white/75 sm:text-sm">{spec.label}</dt>
              <dd className="mt-1 truncate font-medium text-white">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
