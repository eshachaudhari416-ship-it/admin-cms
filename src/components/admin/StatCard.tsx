export function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: any; accent: string }) {
  return (
    <div className="min-w-[160px] flex-1 rounded-xl border border-border bg-surface p-4.5">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-text-dim">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: accent + "22" }}>
          <Icon size={14} color={accent} />
        </div>
      </div>
      <div className="font-display text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
