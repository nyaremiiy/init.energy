import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowLink } from "@/components/ui/arrow-link";

import { featuredProjects, type ProjectSegment } from "@/content/projects";
import { anchors, routes } from "@/content/routes";
import { messages } from "@/lib/messages";

const titleId = "projects-showcase-title";

const filterSegments: Array<{
  id: "all" | ProjectSegment;
  labelKey: "all" | ProjectSegment;
}> = [
  { id: "all", labelKey: "all" },
  { id: "apartment", labelKey: "apartment" },
  { id: "house", labelKey: "house" },
  { id: "business", labelKey: "business" },
];

export function ProjectsShowcase() {
  const t = messages.projects;

  // Drafts (test records) are visible only in development; no projects → no section.
  if (featuredProjects.length === 0) {
    return null;
  }

  const [featuredProject, ...secondaryProjects] = featuredProjects;

  return (
    <section
      id={anchors.projects}
      aria-labelledby={titleId}
      className="scroll-mt-24 bg-white pt-section-sm lg:pt-section"
    >
      <Container className="flex flex-col gap-section-head">
        <Reveal>
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            titleId={titleId}
            lead={t.lead}
            aside={
              <ArrowLink href={routes.projects}>{t.allProjects}</ArrowLink>
            }
          />
        </Reveal>

        <div className="flex flex-col gap-6">
          <nav aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {filterSegments.map((segment) => {
              const isActive = segment.id === "all";
              const href = `${routes.projects}?segment=${segment.id}`;

              return (
                <Link
                  key={segment.id}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                    isActive
                      ? "border-ink bg-ink text-white"
                      : "border-ink/20 text-ink hover:border-ink"
                  }`}
                >
                  {t.filters[segment.labelKey]}
                </Link>
              );
            })}
          </nav>

          <div className="grid grid-cols-1 gap-4 lg:h-180 lg:grid-cols-12 lg:grid-rows-2">
            <Reveal className="h-105 lg:col-span-7 lg:row-span-2 lg:h-auto">
              <ProjectCard project={featuredProject} variant="large" />
            </Reveal>
            {secondaryProjects.map((project, index) => (
              <Reveal
                key={project.slug}
                delay={(index + 1) * 0.12}
                className="h-105 lg:col-span-5 lg:h-auto"
              >
                <ProjectCard project={project} variant="small" />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
