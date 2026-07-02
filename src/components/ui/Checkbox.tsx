import { Check } from "lucide-react";
import clsx from "clsx";

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={clsx(
        "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded border transition-colors",
        checked ? "border-accent bg-accent" : "border-border bg-surface2"
      )}
    >
      {checked && <Check size={11} color="#fff" strokeWidth={3} />}
    </button>
  );
}
