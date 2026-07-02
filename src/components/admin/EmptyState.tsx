import { Inbox, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-14 text-center text-text-dim">
      <Inbox size={28} className="mx-auto mb-3 opacity-50" />
      <div className="mb-1 font-semibold text-text">No {label} found</div>
      <div className="text-sm">Try clearing filters, or add a new entry to get started.</div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string | null; onRetry: () => void }) {
  return (
    <div className="py-14 text-center">
      <AlertTriangle size={28} className="mx-auto mb-3 text-danger" />
      <div className="mb-1 font-semibold">Couldn't load this data</div>
      <div className="mb-4 text-sm text-text-dim">{message ?? "The request failed. Check your connection and try again."}</div>
      <Button variant="ghost" onClick={onRetry} className="mx-auto">
        Retry
      </Button>
    </div>
  );
}

export function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns + 1 }).map((_, c) => (
            <td key={c} className="px-3.5 py-3">
              <div className="h-3.5 animate-pulse rounded bg-surface2" style={{ width: c === 0 ? "70%" : "50%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
