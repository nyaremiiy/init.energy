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
  /** Fields chosen from outside the form: `?type=` from a niche page. */
  sources: Partial<Record<SesField, "url">>;
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
export function SesPaybackProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(sesPaybackDefaults);
  const [changed, setChanged] = useState<ReadonlySet<SesField>>(new Set());
  const [sources, setSources] = useState<Partial<Record<SesField, "url">>>({});

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
      setSources({ objectType: "url" });
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
        // A field the visitor changed is no longer «from the URL».
        if (next.objectType !== undefined) setSources({});
      },
      changed,
      sources,
      resetChanged: () => {
        setChanged(new Set());
        setSources({});
      },
      input,
      result: calculateSes(input),
    };
  }, [state, changed, sources]);

  return <SesPaybackContext value={value}>{children}</SesPaybackContext>;
}

export function useSesPayback(): ContextValue {
  const value = useContext(SesPaybackContext);
  if (!value) throw new Error("useSesPayback must be used inside SesPaybackProvider");
  return value;
}
