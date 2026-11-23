"use client";

import { createContext, type ReactNode, useContext, useId } from "react";

/** Shared by Field and every control inside it (id, aria wiring, error, tone). */
export type FieldTone = "light" | "dark";

type FieldContextValue = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  tone: FieldTone;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

type FieldBaseProps = {
  /** Visible label. Always shown; placeholders are examples only. */
  label: string;
  /** Marks an optional field (required fields are not marked). */
  optional?: boolean;
  /** Localised text for the optional marker, e.g. «(необов'язково)». */
  optionalLabel?: string;
  /** Keeps the message line height even without text (forms: errors must not shift the layout). */
  reserveMessage?: boolean;
  hint?: string;
  /** Replaces the hint; message line keeps its space either way. */
  error?: string;
  tone?: FieldTone;
};

type FieldProps = FieldBaseProps & {
  id?: string;
  children: ReactNode;
  className?: string;
};

const labelTone: Record<FieldTone, { text: string; muted: string; message: string }> = {
  light: { text: "text-ink", muted: "text-muted", message: "text-ink" },
  dark: { text: "text-white", muted: "text-muted-dark", message: "text-white" },
};

/**
 * Message line under a control: the error replaces the hint, space is always reserved.
 * Not a live region: errors appear on submit and focus moves to the first invalid
 * control, which reads its message through aria-describedby. One alert per field
 * would read every error at once and talk over the focused one.
 */
export function FieldMessage({ id, text, tone = "light", reserve = false }: { id: string; text?: string; tone?: FieldTone; reserve?: boolean }) {
  // Without reserve (calculators) the line exists only when there is text; forms reserve it so errors never shift the layout.
  if (!reserve && !text) return null;
  return (
    <p
      id={id}
      className={`min-h-5 text-small ${labelTone[tone].message} ${text ? "opacity-100" : "opacity-0"} transition-opacity duration-200 ease-tech`}
    >
      {text ?? ""}
    </p>
  );
}

/** One labelled control: label → control (8 px) → message line (8 px). */
export function Field({ label, optional = false, optionalLabel, reserveMessage = false, hint, error, tone = "light", id: idProp, children, className }: FieldProps) {
  const generated = useId();
  const id = idProp ?? generated;
  const messageId = `${id}-message`;
  const message = error ?? hint;
  const invalid = Boolean(error);
  const t = labelTone[tone];

  return (
    <FieldContext.Provider value={{ id, describedBy: messageId, invalid, tone }}>
      <div className={`flex min-w-0 flex-col gap-2 ${className ?? ""}`}>
        <label htmlFor={id} className={`text-small font-medium ${t.text}`}>
          {label}
          {optional && optionalLabel ? <span className={`font-normal ${t.muted}`}> ({optionalLabel})</span> : null}
        </label>
        {children}
        <FieldMessage id={messageId} text={message} tone={tone} reserve={reserveMessage} />
      </div>
    </FieldContext.Provider>
  );
}

/** Fieldset with a visible legend, used for radio pills and other groups of choices. */
export function FieldGroup({ legend, hint, error, tone = "light", children, className }: Omit<FieldBaseProps, "label"> & { legend: string; children: ReactNode; className?: string }) {
  const generated = useId();
  const messageId = `${generated}-message`;
  const message = error ?? hint;
  const t = labelTone[tone];

  return (
    <fieldset
      aria-describedby={message ? messageId : undefined}
      aria-invalid={error ? true : undefined}
      className={`m-0 flex min-w-0 flex-col gap-2 border-0 p-0 ${className ?? ""}`}
    >
      <legend className={`mb-1 text-small font-medium ${t.text}`}>{legend}</legend>
      {children}
      <FieldMessage id={messageId} text={message} tone={tone} />
    </fieldset>
  );
}
