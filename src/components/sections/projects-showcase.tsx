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
import { getMessages } from "@/i18n/server";

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
  const messages = getMessages();
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
          <Reveal delay={0.06} distance={12}>
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
                      isActive
                        ? undefined
                        : `projects-filter-soon-${segment.id}`
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
          </Reveal>

          {/* Height comes from the large card's aspect ratio (16/10 on lg); the two
              small cards share its height (≈ 16/7 each). Mobile: 4/3 per card. */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2">
            <Reveal className="aspect-4/3 md:aspect-video lg:col-span-7 lg:row-span-2 lg:aspect-16/10">
              <ProjectCard project={featuredProject} variant="large" />
            </Reveal>
            {secondaryProjects.map((project, index) => (
              <Reveal
                key={project.slug}
                delay={(index + 1) * 0.12}
                className="aspect-4/3 md:aspect-video lg:col-span-5 lg:aspect-auto"
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
