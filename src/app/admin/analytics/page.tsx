"use client";

import { useEffect, useState } from "react";
import { BarChart3, Search, Users, Flag as FlagIcon } from "lucide-react";
import { ENTITY_SLUGS, ENTITY_REGISTRY } from "@/lib/entities";
import { ENTITY_ICONS } from "@/components/admin/entityIcons";
import { StatCard } from "@/components/admin/StatCard";
import { Topbar } from "@/components/admin/Topbar";
import { ErrorState } from "@/components/admin/EmptyState";

interface AnalyticsData {
  counts: Record<string, number>;
  pendingReports: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error();
      setData(json.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const maxCount = data ? Math.max(1, ...Object.values(data.counts)) : 1;

  return (
    <>
      <Topbar title="Analytics" />
      <div className="flex-1 overflow-y-auto p-5.5">
        <h2 className="font-display text-xl font-bold">Analytics</h2>
        <p className="mb-4.5 mt-0.5 text-sm text-text-dim">Live record counts across every module.</p>

        {error && <ErrorState onRetry={load} />}

        {!error && (
          <>
            <div className="mb-4.5 flex flex-wrap gap-3">
              <StatCard label="Total records" value={data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : "—"} icon={BarChart3} accent="#7c6cff" />
              <StatCard label="Active users" value={data ? data.counts.users : "—"} icon={Users} accent="#00e6a8" />
              <StatCard label="Pending reports" value={data ? data.pendingReports : "—"} icon={FlagIcon} accent="#ff5c7a" />
              <StatCard label="Published tools" value={data ? data.counts.tools : "—"} icon={Search} accent="#ffb84d" />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4.5">
              <span className="font-display mb-4 block text-sm font-bold">Records by module</span>
              <div className="flex flex-col gap-3">
                {ENTITY_SLUGS.map((slug) => {
                  const Icon = ENTITY_ICONS[slug];
                  const count = data?.counts[slug] ?? 0;
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={slug} className="flex items-center gap-3">
                      <Icon size={14} className="shrink-0 text-text-dim" />
                      <span className="w-36 shrink-0 text-sm">{ENTITY_REGISTRY[slug].label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
                        <div className="h-full rounded-full bg-accent transition-all" style={{ width: data ? `${pct}%` : "0%" }} />
                      </div>
                      <span className="font-mono w-10 shrink-0 text-right text-xs text-text-dim">{data ? count : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
