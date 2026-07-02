"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { EntityConfig } from "@/lib/entities";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

interface Props {
  config: EntityConfig;
  initial: Row | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (values: Row) => void;
}

export function EntityForm({ config, initial, busy, onCancel, onSave }: Props) {
  const [values, setValues] = useState<Row>(() => {
    const base: Row = {};
    config.fields.forEach((f) => {
      base[f.key] = initial ? initial[f.key] ?? "" : f.type === "bool" ? false : "";
    });
    return base;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, val: unknown) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit() {
    const errs: Record<string, string> = {};
    config.fields.forEach((f) => {
      if (f.required && !values[f.key] && values[f.key] !== false) errs[f.key] = "Required";
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Client-side check mirrors the server's zod schema so users get instant
    // feedback; the API route re-validates regardless (never trust the client).
    const parsed = (initial ? config.updateSchema : config.schema).safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    onSave(values);
  }

  return (
    <Modal onClose={onCancel}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-bold">
          {initial ? "Edit" : "Add"} {config.label.replace(/s$/, "")}
        </h3>
        <Button variant="icon" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex flex-col gap-3.5 p-5">
        {config.fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-xs font-semibold text-text-dim">
              {f.label}
              {f.required && <span className="text-danger"> *</span>}
            </label>

            {f.type === "text" && (
              <Input value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}`} />
            )}
            {f.type === "number" && (
              <Input type="number" value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}`} />
            )}
            {f.type === "textarea" && (
              <Textarea value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}`} />
            )}
            {f.type === "select" && (
              <Select value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">Select {f.label.toLowerCase()}</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o.charAt(0) + o.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            )}
            {f.type === "bool" && (
              <div className="flex items-center gap-2">
                <Checkbox checked={!!values[f.key]} onChange={() => set(f.key, !values[f.key])} />
                <span className="text-sm text-text-dim">{values[f.key] ? "Yes" : "No"}</span>
              </div>
            )}

            {errors[f.key] && <div className="mt-1 text-xs text-danger">{errors[f.key]}</div>}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-5 py-3.5">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={busy}>
          {busy ? "Saving..." : initial ? "Save changes" : "Create"}
        </Button>
      </div>
    </Modal>
  );
}
