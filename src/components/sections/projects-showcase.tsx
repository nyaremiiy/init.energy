import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Tooltip } from "@/components/ui/tooltip";
import { chipClasses } from "@/components/ui/chip-styles";

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
      className="relative scroll-mt-24 overflow-hidden bg-white pt-section-sm lg:pt-section"
    >
      <SectionWatermark text="PROJECTS" side="right" />
      <Container className="relative flex flex-col gap-section-head-sm lg:gap-section-head">
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

              const chip = (
                // Only "all" is active while there are few projects; other filters stay greyed out.
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={!isActive}
                  aria-describedby={
                    isActive ? undefined : `projects-filter-soon-${segment.id}`
                  }
                  tabIndex={isActive ? undefined : -1}
                  className={chipClasses({
                    selected: isActive,
                    disabled: !isActive,
                  })}
                >
                  {t.filters[segment.labelKey]}
                </Link>
              );

              return isActive ? (
                <span key={segment.id} className="inline-flex">
                  {chip}
                </span>
              ) : (
                <Tooltip
                  key={segment.id}
                  id={`projects-filter-soon-${segment.id}`}
                  text={t.filterSoon}
                >
                  {chip}
                </Tooltip>
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
