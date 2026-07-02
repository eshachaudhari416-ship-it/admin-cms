"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, Building2, Users, Flag } from "lucide-react";
import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { ENTITY_ICONS } from "@/components/admin/entityIcons";
import { StatCard } from "@/components/admin/StatCard";
import { Topbar } from "@/components/admin/Topbar";
import { ErrorState } from "@/components/admin/EmptyState";

interface AnalyticsData {
  counts: Record<string, number>;
  pendingReports: number;
}

export default function DashboardPage() {
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

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-5.5">
        <h2 className="font-display text-xl font-bold">Overview</h2>
        <p className="mb-4.5 mt-0.5 text-sm text-text-dim">Everything happening across the platform, at a glance.</p>

        {error && <ErrorState onRetry={load} />}

        {!error && (
          <>
            <div className="mb-4.5 flex flex-wrap gap-3">
              <StatCard label="Total Tools" value={data ? data.counts.tools : "—"} icon={Wrench} accent="#7c6cff" />
              <StatCard label="Companies" value={data ? data.counts.companies : "—"} icon={Building2} accent="#00e6a8" />
              <StatCard label="Active Users" value={data ? data.counts.users : "—"} icon={Users} accent="#ffb84d" />
              <StatCard label="Pending Reports" value={data ? data.pendingReports : "—"} icon={Flag} accent="#ff5c7a" />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4.5">
              <span className="font-display mb-3 block text-sm font-bold">Module snapshot</span>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {ENTITY_SLUGS.map((slug) => {
                  const Icon = ENTITY_ICONS[slug];
                  return (
                    <Link
                      key={slug}
                      href={`/admin/${slug}`}
                      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface2 p-3 text-left hover:bg-surface3"
                    >
                      <Icon size={16} className="text-accent" />
                      <div>
                        <div className="text-sm font-semibold">{ENTITY_REGISTRY[slug].label}</div>
                        <div className="font-mono text-xs text-text-dim">
                          {data ? data.counts[slug] : "—"} entries
                        </div>
                      </div>
                    </Link>
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
