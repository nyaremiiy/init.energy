"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { defaultApplianceIds } from "@/content/appliances";
import { sesCalculatorConfig } from "@/content/ses-calculator";
import { householdTariff } from "@/content/tariffs";
import { calculateSes, type SesCalculation, type SesCalculationInput, type SesGoal, type SesObjectType, type SesPlacement } from "@/lib/calc/ses";

export type SesPaybackState = {
  objectType: SesObjectType;
  goal: SesGoal;
  monthlyKwh: number;
  /** Monthly bill in UAH; when set (> 0) it replaces `monthlyKwh`. */
  monthlyBill: number;
  tariff: number;
  regionId: string;
  placement: SesPlacement;
  /** m², 0 = not limited. */
  roofArea: number;
  backupLoads: string[];
  backupHours: number;
  /** UAH, 0 = not set. */
  budget: number;
};

/** Defaults: the same values the server uses for the example in the method section. */
export const sesPaybackDefaults: SesPaybackState = {
  objectType: sesCalculatorConfig.defaults.objectType,
  goal: sesCalculatorConfig.defaults.goal,
  monthlyKwh: sesCalculatorConfig.consumption.default,
  monthlyBill: 0,
  tariff: householdTariff.value,
  regionId: sesCalculatorConfig.defaults.regionId,
  placement: sesCalculatorConfig.defaults.placement,
  roofArea: 0,
  backupLoads: [...defaultApplianceIds],
  backupHours: sesCalculatorConfig.backupHours.default,
  budget: 0,
};

export function toCalculationInput(state: SesPaybackState): SesCalculationInput {
  return {
    objectType: state.objectType,
    goal: state.goal,
    monthlyKwh: state.monthlyBill > 0 ? undefined : state.monthlyKwh,
    monthlyBill: state.monthlyBill > 0 ? state.monthlyBill : undefined,
    tariff: state.tariff,
    regionId: state.regionId,
    placement: state.placement,
    roofAreaM2: state.roofArea || undefined,
    backupLoads: state.backupLoads,
    backupHours: state.backupHours,
    budget: state.budget || undefined,
  };
}

export type SesField = keyof SesPaybackState;
export type FieldSource = "url" | "page";

type ContextValue = {
  state: SesPaybackState;
  /**
   * Merges a visitor's change into the state. Every key of `next` counts as
   * chosen unless `chosen` names the fields; `reset` fields went back to
   * defaults on their own (e.g. the tariff when switching to business).
   */
  update: (next: Partial<SesPaybackState>, options?: { chosen?: SesField[]; reset?: SesField[] }) => void;
  /** Fields the visitor touched (sent to the lead as `selected`). */
  changed: ReadonlySet<SesField>;
  /** Fields chosen outside the form: `?type=` from a niche page, the region of a region page. */
  sources: Partial<Record<SesField, FieldSource>>;
  /** Forgets the touched fields (after a successful lead submit). */
  resetChanged: () => void;
  input: SesCalculationInput;
  result: SesCalculation;
};

const SesPaybackContext = createContext<ContextValue | null>(null);

/**
 * Calculator state for the whole page: the form, the result card, the
 * monthly chart and the summary next to the lead form read the same values.
 * Nothing is written to the URL: the page stays one static, indexable URL.
 */
/** A region page preselects its region: it counts as chosen (source «page»). */
const initialChanged = (regionId?: string): ReadonlySet<SesField> => new Set<SesField>(regionId ? ["regionId"] : []);
const initialSources = (regionId?: string): Partial<Record<SesField, FieldSource>> => (regionId ? { regionId: "page" } : {});

export function SesPaybackProvider({ children, regionId }: { children: ReactNode; regionId?: string }) {
  const [state, setState] = useState<SesPaybackState>(() => (regionId ? { ...sesPaybackDefaults, regionId } : sesPaybackDefaults));
  const [changed, setChanged] = useState(() => initialChanged(regionId));
  const [sources, setSources] = useState(() => initialSources(regionId));

  // Links from niche pages preselect the object type: ?type=business. Read once,
  // never written back — the page keeps one parameter-free URL. Counts as chosen.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type !== "apartment" && type !== "house" && type !== "business") return;
    // After hydration (the server renders the defaults). Business has no
    // regulated tariff: the user enters their own price.
    const id = window.setTimeout(() => {
      setState((current) => ({ ...current, objectType: type, tariff: type === "business" ? 0 : current.tariff }));
      setChanged((current) => new Set(current).add("objectType"));
      setSources((current) => ({ ...current, objectType: "url" }));
    });
    return () => window.clearTimeout(id);
  }, []);

  const value = useMemo<ContextValue>(() => {
    const input = toCalculationInput(state);
    return {
      state,
      update: (next, options) => {
        setState((current) => ({ ...current, ...next }));
        setChanged((current) => {
          const updated = new Set(current);
          options?.reset?.forEach((field) => updated.delete(field));
          (options?.chosen ?? (Object.keys(next) as SesField[])).forEach((field) => updated.add(field));
          return updated;
        });
        // A field the visitor changed is no longer «from the URL / page».
        setSources((current) => {
          const keys = options?.chosen ?? (Object.keys(next) as SesField[]);
          if (!keys.some((key) => key in current)) return current;
          const updated = { ...current };
          keys.forEach((key) => delete updated[key]);
          return updated;
        });
      },
      changed,
      sources,
      // After a submit the page's own region stays chosen.
      resetChanged: () => {
        setChanged(initialChanged(regionId));
        setSources(initialSources(regionId));
      },
      input,
      result: calculateSes(input),
    };
  }, [state, changed, sources, regionId]);

  return <SesPaybackContext value={value}>{children}</SesPaybackContext>;
}

export function useSesPayback(): ContextValue {
  const value = useContext(SesPaybackContext);
  if (!value) throw new Error("useSesPayback must be used inside SesPaybackProvider");
  return value;
}
