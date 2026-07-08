"use client";

import { ImageIcon, Pencil, Trash2, Star, BarChart2, Lock, Unlock } from "lucide-react";
import { EntityConfig } from "@/lib/entities";
import { avatarStyle } from "@/lib/avatarColor";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState } from "./EmptyState";
import { Button } from "@/components/ui/Button";
import { ViewState } from "@/hooks/useEntityData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US", { notation: n > 9999 ? "compact" : "standard" }).format(n);
}
function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-video animate-pulse bg-surface2" />
      <div className="space-y-2 p-3.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface2" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface2" />
      </div>
    </div>
  );
}

interface Props {
  config: EntityConfig;
  rows: Row[];
  viewState: ViewState;
  errorMessage: string | null;
  refetch: () => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
}

export function CardGrid({ config, rows, viewState, errorMessage, refetch, onEdit, onDelete }: Props) {
  if (viewState === "loading") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <ErrorState message={errorMessage} onRetry={refetch} />
      </div>
    );
  }

  if (viewState === "empty") {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState label={config.label.toLowerCase()} />
      </div>
    );
  }

  // The "badge" column: first non-title text column (category/curator/channel/pricing-like).
  const badgeColumn = config.columns.find((c) => c.type === "text" && c.key !== config.titleField);
  const statColumns = config.columns.filter((c) => c.type === "number" || c.type === "rating");
  const tagColumns = config.columns.filter(
    (c) => c.type === "text" && c.key !== config.titleField && c.key !== badgeColumn?.key
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rows.map((row) => (
        <div
          key={row.id}
          className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/40"
        >
          <div
            className="relative aspect-video"
            style={{ background: row.imageUrl ? undefined : avatarStyle(row[config.titleField] || "?").bg }}
          >
            {row.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.imageUrl}
                alt={row[config.titleField]}
                className="h-full w-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={22} className="text-white/70" />
              </div>
            )}

            {badgeColumn && row[badgeColumn.key] && (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                {row[badgeColumn.key]}
              </span>
            )}

            <div className="absolute right-2.5 top-2.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onEdit(row)}
                className="rounded-md bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => onDelete(row)}
                className="rounded-md bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {statColumns.length > 0 && (
              <div className="absolute bottom-2.5 left-2.5 flex gap-2">
                {statColumns.map((c) => (
                  <span
                    key={c.key}
                    className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"
                  >
                    {c.type === "rating" ? (
                      <Star size={10} fill="#ffb84d" color="#ffb84d" />
                    ) : (
                      <BarChart2 size={10} />
                    )}
                    {c.type === "rating" ? row[c.key] : fmtNum(row[c.key] ?? 0)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5">
            <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug">{row[config.titleField]}</h3>

            {tagColumns.length > 0 && (
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {tagColumns.map((c) =>
                  row[c.key] ? (
                    <span
                      key={c.key}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface2 px-2 py-0.5 text-[11px] font-medium text-text-dim"
                    >
                      {c.key === "pricing" &&
                        (row[c.key] === "PAID" ? <Lock size={9} /> : <Unlock size={9} />)}
                      {row[c.key]}
                    </span>
                  ) : null
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              {row.status ? <StatusBadge status={row.status} /> : <span />}
              {row.createdAt && <span className="text-[11px] text-text-faint">{fmtDate(row.createdAt)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
