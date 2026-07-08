"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpDown, Pencil, Plus, Search, Trash2, ChevronLeft, ChevronRight, Star, BarChart2, LayoutGrid, List, Lock, Unlock } from "lucide-react";
import { EntityConfig } from "@/lib/entities";
import { useEntityData } from "@/hooks/useEntityData";
import { avatarStyle } from "@/lib/avatarColor";
import { StatusBadge, statusColor } from "./StatusBadge";
import { EmptyState, ErrorState, LoadingRows } from "./EmptyState";
import { EntityForm } from "./EntityForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { CardGrid } from "./CardGrid";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US", { notation: n > 9999 ? "compact" : "standard" }).format(n);
}
function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export function DataTable({ config }: { config: EntityConfig }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">(config.hasImageView ? "grid" : "table");

  const { rows, total, totalPages, viewState, errorMessage, refetch } = useEntityData<Row>(config.slug, {
    search,
    status,
    sortKey,
    sortDir,
    page,
    pageSize: 8,
  });

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  function toggleSelect(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function handleSave(values: Row) {
    setBusy(true);
    try {
      const isEdit = Boolean(editing?.id);
      const url = isEdit ? `/api/admin/${config.slug}/${editing!.id}` : `/api/admin/${config.slug}`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Save failed");
      setShowForm(false);
      setEditing(null);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/${config.slug}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Delete failed");
      setDeleting(null);
      setSelected((s) => s.filter((x) => x !== id));
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkDelete() {
    setBusy(true);
    try {
      await Promise.all(selected.map((id) => fetch(`/api/admin/${config.slug}/${id}`, { method: "DELETE" })));
      setSelected([]);
      refetch();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-[fadeIn_.25s_ease]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{config.label}</h2>
          <p className="mt-0.5 text-sm text-text-dim">{total} total entries</p>
        </div>
        <div className="flex items-center gap-2">
          {config.hasImageView && (
            <div className="flex gap-0.5 rounded-lg border border-border bg-surface2 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-surface3 text-text" : "text-text-faint hover:text-text-dim"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 ${viewMode === "table" ? "bg-surface3 text-text" : "text-text-faint hover:text-text-dim"}`}
              >
                <List size={15} />
              </button>
            </div>
          )}
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Plus size={14} /> Add {config.label.replace(/s$/, "")}
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-3.5">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-2.5 text-text-faint" />
          <Input
            ref={searchRef}
            className="pl-8 pr-8"
            placeholder={`Search ${config.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          {!search && (
            <kbd className="pointer-events-none absolute right-2.5 top-2 rounded border border-border bg-surface2 px-1.5 py-0.5 font-mono text-[10px] text-text-faint">
              /
            </kbd>
          )}
        </div>
        {selected.length > 0 && (
          <Button variant="danger" onClick={handleBulkDelete} disabled={busy}>
            <Trash2 size={13} /> Delete {selected.length} selected
          </Button>
        )}
      </div>

      {config.statusEnum && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setPage(1);
              setStatus("all");
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              status === "all"
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface2 text-text-dim hover:bg-surface3 hover:text-text"
            }`}
          >
            All {config.label}
          </button>
          {config.statusEnum.map((s) => (
            <button
              key={s}
              onClick={() => {
                setPage(1);
                setStatus(s);
              }}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                status === s
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface2 text-text-dim hover:bg-surface3 hover:text-text"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {viewMode === "grid" && config.hasImageView ? (
        <CardGrid
          config={config}
          rows={rows}
          viewState={viewState}
          errorMessage={errorMessage}
          refetch={refetch}
          onEdit={(row) => {
            setEditing(row);
            setShowForm(true);
          }}
          onDelete={(row) => setDeleting(row)}
        />
      ) : (
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-9 border-b border-border" />
              {config.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap border-b border-border px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-faint"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label} <ArrowUpDown size={11} className={sortKey === col.key ? "opacity-100" : "opacity-30"} />
                  </span>
                </th>
              ))}
              <th className="w-24 border-b border-border px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-faint">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {viewState === "loading" && <LoadingRows columns={config.columns.length} />}
            {viewState === "error" && (
              <tr>
                <td colSpan={config.columns.length + 2}>
                  <ErrorState message={errorMessage} onRetry={refetch} />
                </td>
              </tr>
            )}
            {viewState === "empty" && (
              <tr>
                <td colSpan={config.columns.length + 2}>
                  <EmptyState label={config.label.toLowerCase()} />
                </td>
              </tr>
            )}
            {viewState === "idle" &&
              rows.map((row) => {
                const color = row.status ? statusColor(row.status) : null;
                return (
                  <tr key={row.id} className="relative transition-colors hover:bg-surface2">
                    <td className="relative w-0 p-0">
                      {color && <span className="absolute inset-y-0 left-0 w-[3px] rounded-r" style={{ background: color }} />}
                      <div className="pl-3.5 py-3">
                        <Checkbox checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                      </div>
                    </td>
                    {config.columns.map((col) => (
                      <td key={col.key} className="border-b border-border px-3.5 py-3 text-sm">
                        {col.type === "status" && <StatusBadge status={row[col.key]} />}
                        {col.type === "bool" &&
                          (row[col.key] ? (
                            <span className="font-semibold text-accent-2">Yes</span>
                          ) : (
                            <span className="text-text-faint">No</span>
                          ))}
                        {col.type === "date" && <span className="font-mono text-xs text-text-dim">{fmtDate(row[col.key])}</span>}
                        {col.type === "number" && (
                          <span className="inline-flex items-center gap-1 font-mono text-text-dim">
                            <BarChart2 size={11} /> {fmtNum(row[col.key])}
                          </span>
                        )}
                        {col.type === "mono" && <span className="font-mono text-xs text-text-dim">{row[col.key]}</span>}
                        {col.type === "rating" && (
                          <span className="inline-flex items-center gap-1">
                            <Star size={12} fill="#ffb84d" color="#ffb84d" /> {row[col.key]}
                          </span>
                        )}
                        {col.type === "text" && col.key === config.titleField && (
                          <span className="inline-flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                              style={{ background: avatarStyle(row[col.key] || "?").bg, color: avatarStyle(row[col.key] || "?").text }}
                            >
                              {(row[col.key] || "?").charAt(0).toUpperCase()}
                            </span>
                            <span className="font-semibold">{row[col.key]}</span>
                          </span>
                        )}
                        {col.type === "text" && col.key !== config.titleField && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface2 px-2.5 py-0.5 text-xs font-medium text-text-dim">
                            {col.key === "pricing" &&
                              (row[col.key] === "PAID" ? (
                                <Lock size={10} />
                              ) : (
                                <Unlock size={10} />
                              ))}
                            {row[col.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="border-b border-border px-3.5 py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="icon"
                          onClick={() => {
                            setEditing(row);
                            setShowForm(true);
                          }}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button variant="icon" onClick={() => setDeleting(row)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      )}

      {viewState === "idle" && rows.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-text-dim">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <Button variant="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={15} />
            </Button>
            <Button variant="icon" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {showForm && (
        <EntityForm
          config={config}
          initial={editing}
          busy={busy}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
      {deleting && (
        <ConfirmDialog
          label={deleting[config.titleField]}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => handleDelete(deleting.id)}
        />
      )}
    </div>
  );
}
