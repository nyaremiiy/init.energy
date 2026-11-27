"use client";

import { BatteryCharging, Cable, Gauge, House, Sun, UtilityPole, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";

export type PlantType = "grid" | "hybrid" | "battery";
export type PlantMode = "day" | "night" | "outage";
type NodeId = "grid" | "meter" | "inverter" | "panels" | "battery" | "house";
/** Edges are drawn from → to; a flow runs forward or against that direction. */
type EdgeId = "gridMeter" | "meterInverter" | "panelsInverter" | "inverterBattery" | "inverterHouse";
type Flow = "forward" | "reverse";

export type DiagramLabels = {
  title: string;
  desc: string;
  tabsLabel: string;
  modesLabel: string;
  types: Record<PlantType, string>;
  modes: Record<PlantMode, string>;
  captions: Record<PlantType, Record<PlantMode, string>>;
  nodes: {
    grid: string; gridNote: string; gridOff: string;
    meter: string; meterNote: string;
    inverterHybrid: string; inverterGrid: string; inverterNote: string; inverterOff: string;
    panels: string; panelsNote: string;
    battery: string; batteryNote: string; batteryLater: string;
    house: string; houseNote: string;
  };
};

/** Which lines carry energy, and which way, for each plant type and moment. */
const flows: Record<PlantType, Record<PlantMode, Partial<Record<EdgeId, Flow>>>> = {
  grid: {
    day: { panelsInverter: "forward", inverterHouse: "forward", meterInverter: "reverse", gridMeter: "reverse" },
    night: { gridMeter: "forward", meterInverter: "forward", inverterHouse: "forward" },
    outage: {},
  },
  hybrid: {
    day: { panelsInverter: "forward", inverterHouse: "forward", meterInverter: "reverse", gridMeter: "reverse" },
    night: { gridMeter: "forward", meterInverter: "forward", inverterHouse: "forward" },
    outage: { panelsInverter: "forward", inverterHouse: "forward" },
  },
  battery: {
    day: { panelsInverter: "forward", inverterHouse: "forward", inverterBattery: "forward", meterInverter: "reverse", gridMeter: "reverse" },
    night: { inverterBattery: "reverse", inverterHouse: "forward" },
    outage: { panelsInverter: "forward", inverterBattery: "reverse", inverterHouse: "forward" },
  },
};

type Layout = {
  viewBox: string;
  /** Font classes of the node title and note: the phone diagram is scaled down, so its text is set larger. */
  text: { title: string; note: string; titleY: number; noteY: number };
  node: { w: number; h: number };
  nodes: Record<NodeId, { x: number; y: number }>;
  edges: Record<EdgeId, string>;
};

/** Desktop: grid → meter → inverter in a row, panels above right, battery below right, house under the inverter. */
const wide: Layout = {
  viewBox: "0 0 1010 352",
  text: { title: "text-small", note: "text-caption", titleY: -3, noteY: 16 },
  node: { w: 230, h: 76 },
  nodes: {
    grid: { x: 4, y: 132 },
    meter: { x: 262, y: 132 },
    inverter: { x: 520, y: 132 },
    panels: { x: 776, y: 18 },
    battery: { x: 776, y: 258 },
    house: { x: 520, y: 268 },
  },
  edges: {
    gridMeter: "M234 170 H262",
    meterInverter: "M492 170 H520",
    panelsInverter: "M776 56 H763 V156 H750",
    inverterBattery: "M750 184 H763 V296 H776",
    inverterHouse: "M635 208 V268",
  },
};

/**
 * Phones: one column top to bottom — panels, inverter, house, battery, meter,
 * grid; the battery and meter lines run along the right and left edges.
 */
const tall: Layout = {
  viewBox: "0 0 360 648",
  text: { title: "text-lead", note: "text-body", titleY: -4, noteY: 20 },
  node: { w: 300, h: 72 },
  nodes: {
    panels: { x: 30, y: 8 },
    inverter: { x: 30, y: 120 },
    house: { x: 30, y: 232 },
    battery: { x: 30, y: 344 },
    meter: { x: 30, y: 456 },
    grid: { x: 30, y: 568 },
  },
  edges: {
    panelsInverter: "M180 80 V120",
    inverterHouse: "M180 192 V232",
    inverterBattery: "M330 156 H348 V380 H330",
    meterInverter: "M30 492 H12 V156 H30",
    gridMeter: "M180 568 V528",
  },
};

const icons: Record<NodeId, LucideIcon> = { grid: UtilityPole, meter: Gauge, inverter: Zap, panels: Sun, battery: BatteryCharging, house: House };

function Diagram({ layout, type, mode, labels, titleId, descId }: { layout: Layout; type: PlantType; mode: PlantMode; labels: DiagramLabels; titleId: string; descId: string }) {
  const active = flows[type][mode];
  const l = labels.nodes;
  const gridOff = mode === "outage";
  const inverterOff = type === "grid" && mode === "outage";
  const text: Record<NodeId, [string, string]> = {
    grid: [l.grid, gridOff ? l.gridOff : l.gridNote],
    meter: [l.meter, l.meterNote],
    inverter: [type === "grid" ? l.inverterGrid : l.inverterHybrid, inverterOff ? l.inverterOff : l.inverterNote],
    panels: [l.panels, l.panelsNote],
    battery: [l.battery, type === "hybrid" ? l.batteryLater : l.batteryNote],
    house: [l.house, l.houseNote],
  };
  const hidden = (id: NodeId | EdgeId) => type === "grid" && (id === "battery" || id === "inverterBattery");
  const muted = (id: NodeId | EdgeId) =>
    (gridOff && (id === "grid" || id === "gridMeter" || id === "meterInverter")) || (inverterOff && id === "inverter") || (type === "hybrid" && (id === "battery" || id === "inverterBattery"));

  return (
    <svg viewBox={layout.viewBox} role="img" aria-labelledby={`${titleId} ${descId}`} className="h-auto w-full">
      <title id={titleId}>{labels.title}</title>
      <desc id={descId}>{labels.desc}</desc>

      {(Object.keys(layout.edges) as EdgeId[]).map((id) => {
        if (hidden(id)) return null;
        const flow = active[id];
        return (
          <g key={id}>
            <path d={layout.edges[id]} fill="none" strokeWidth={2} strokeDasharray={muted(id) ? "4 6" : undefined} className={muted(id) ? "stroke-faint" : "stroke-line"} />
            {flow ? (
              <path
                d={layout.edges[id]}
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="6 10"
                className="energy-flow stroke-accent"
                style={{ animationDirection: flow === "reverse" ? "reverse" : "normal" } as CSSProperties}
              />
            ) : null}
          </g>
        );
      })}

      {(Object.keys(layout.nodes) as NodeId[]).map((id) => {
        if (hidden(id)) return null;
        const { x, y } = layout.nodes[id];
        const Icon = id === "grid" && gridOff ? Cable : icons[id];
        const strong = id === "inverter" && !inverterOff;
        const dimmed = muted(id);
        return (
          <g key={id} className={dimmed ? "opacity-60" : undefined}>
            <rect
              x={x}
              y={y}
              width={layout.node.w}
              height={layout.node.h}
              rx={16}
              strokeWidth={1}
              strokeDasharray={dimmed ? "6 6" : undefined}
              className={strong ? "fill-ink stroke-ink" : "fill-white stroke-line"}
            />
            <circle cx={x + 30} cy={y + layout.node.h / 2} r={17} className={strong ? "fill-white" : "fill-surface"} />
            <Icon
              x={x + 20}
              y={y + layout.node.h / 2 - 10}
              width={20}
              height={20}
              strokeWidth={1.7}
              className={`text-ink ${id === "panels" && mode !== "night" ? "motion-safe:animate-pulse" : ""}`}
              aria-hidden
            />
            <text x={x + 56} y={y + layout.node.h / 2 + layout.text.titleY} className={`font-heading font-semibold ${layout.text.title} ${strong ? "fill-white" : "fill-ink"}`}>
              {text[id][0]}
            </text>
            <text x={x + 56} y={y + layout.node.h / 2 + layout.text.noteY} className={`${layout.text.note} ${strong ? "fill-muted-dark" : "fill-muted"}`}>
              {text[id][1]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Plant diagram (inline SVG, text in the HTML): tabs pick the plant type,
 * a second switch the moment — day, night or an outage — which changes the
 * flows and the caption. The dashes run only while the diagram is on screen.
 */
export function PowerDiagram({ labels }: { labels: DiagramLabels }) {
  const [type, setType] = useState<PlantType>("battery");
  const [mode, setMode] = useState<PlantMode>("day");
  const ref = useRef<HTMLElement>(null);
  const id = useId();
  const figureId = `${id}-figure`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.running = entry.isIntersecting ? "true" : "false";
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const types: PlantType[] = ["grid", "hybrid", "battery"];
  const modes: PlantMode[] = ["day", "night", "outage"];

  return (
    <div className="flex flex-col gap-6 rounded-card bg-white p-card-sm lg:p-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedTabs
          label={labels.tabsLabel}
          idPrefix={`${id}-type`}
          wrap
          value={type}
          onChange={setType}
          tabs={types.map((item) => ({ id: item, label: labels.types[item], controls: figureId }))}
        />
        <SegmentedTabs
          label={labels.modesLabel}
          idPrefix={`${id}-mode`}
          wrap
          value={mode}
          onChange={setMode}
          tabs={modes.map((item) => ({ id: item, label: labels.modes[item], controls: figureId }))}
        />
      </div>

      <figure ref={ref} id={figureId} className="flex flex-col gap-4">
        <div className="hidden md:block">
          <Diagram layout={wide} type={type} mode={mode} labels={labels} titleId={`${id}-title-wide`} descId={`${id}-desc-wide`} />
        </div>
        <div className="mx-auto w-full max-w-sm md:hidden">
          <Diagram layout={tall} type={type} mode={mode} labels={labels} titleId={`${id}-title-tall`} descId={`${id}-desc-tall`} />
        </div>
        <figcaption key={`${type}-${mode}`} className="text-body text-muted motion-safe:animate-enter">
          {labels.captions[type][mode]}
        </figcaption>
      </figure>
    </div>
  );
}
