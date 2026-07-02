const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  PUBLISHED: { color: "#00e6a8", bg: "rgba(0,230,168,0.14)", label: "Published" },
  ACTIVE:    { color: "#00e6a8", bg: "rgba(0,230,168,0.14)", label: "Active" },
  RESOLVED:  { color: "#00e6a8", bg: "rgba(0,230,168,0.14)", label: "Resolved" },
  DRAFT:     { color: "#ffb84d", bg: "rgba(255,184,77,0.14)", label: "Draft" },
  PENDING:   { color: "#ffb84d", bg: "rgba(255,184,77,0.14)", label: "Pending" },
  FLAGGED:   { color: "#ff5c7a", bg: "rgba(255,92,122,0.14)", label: "Flagged" },
  SUSPENDED: { color: "#ff5c7a", bg: "rgba(255,92,122,0.14)", label: "Suspended" },
  ARCHIVED:  { color: "#8a8a93", bg: "rgba(138,138,147,0.14)", label: "Archived" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { color: "#8a8a93", bg: "rgba(138,138,147,0.14)", label: status };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

export function statusColor(status: string) {
  return STATUS_META[status]?.color ?? "#8a8a93";
}
