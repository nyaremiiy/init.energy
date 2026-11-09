import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

import { navCta, type NavGroup } from "./header-data";
import { NavLink } from "./nav-link";

type MegaMenuPanelProps = {
  group: NavGroup;
  open: boolean;
};

export function MegaMenuPanel({ group, open }: MegaMenuPanelProps) {
  return (
    <div
      className={`absolute inset-x-0 top-full transition duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="rounded-b-3xl border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <Container className="flex gap-10 py-10">
          <div className="grid flex-1 auto-cols-fr grid-flow-col gap-10">
            {group.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-5">
                <Eyebrow tone="dark" as="p">
                  {column.title}
                </Eyebrow>
                <ul className="flex flex-col gap-5">
                  {column.items.map((link) => (
                    <li key={link.href}>
                      <NavLink
                        href={link.href}
                        className="group/link flex flex-col gap-1"
                      >
                        <span className="text-base font-semibold text-white/90 transition-colors duration-150 ease-tech group-hover/link:text-white">
                          {link.label}
                        </span>
                        <span className="text-sm text-white/70">
                          {link.description}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex w-80 flex-col items-start gap-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="text-lg font-semibold text-white">{navCta.title}</p>
            <p className="text-sm text-white/65">{navCta.text}</p>
            <Button
              href={navCta.href}
              className="mt-2"
              icon={<ArrowUpRight aria-hidden className="size-4" />}
            >
              {navCta.label}
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
