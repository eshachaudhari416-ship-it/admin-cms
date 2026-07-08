"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Box, Wand2, Clapperboard } from "lucide-react";
import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { ENTITY_ICONS } from "@/components/admin/entityIcons";
import { Topbar } from "@/components/admin/Topbar";
import { ErrorState } from "@/components/admin/EmptyState";
import { avatarStyle } from "@/lib/avatarColor";

interface AnalyticsData {
  counts: Record<string, number>;
  pendingReports: number;
}

const MODULE_DESCRIPTIONS: Record<string, string> = {
  tools: "Discover, edit, and publish AI tools across every category.",
  companies: "Track the companies building today's AI products.",
  models: "Manage AI model listings, pricing, and documentation.",
  categories: "Organize the categories and tasks tools are grouped under.",
  collections: "Curate hand-picked tool collections for the homepage.",
  news: "Publish and manage AI news and dispatches.",
  videos: "Manage video content and embedded players.",
  repositories: "Track open-source repositories linked to tools.",
  users: "Manage platform users, roles, and account status.",
  reports: "Review and resolve user-submitted content reports.",
};

const FEATURED_SLUGS = ["tools", "companies"];

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

  const totalEntries = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : null;

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {error && <ErrorState onRetry={load} />}

        {!error && (
          <div className="mx-auto max-w-6xl">
            {/* Hero */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-surface px-5 py-8 sm:mb-10 sm:px-8 sm:py-12">
              <div className="absolute right-16 top-10 hidden h-10 w-10 rotate-6 items-center justify-center rounded-xl bg-surface3 text-text-dim lg:flex">
                <Box size={18} />
              </div>
              <div className="absolute right-36 top-24 hidden h-10 w-10 -rotate-6 items-center justify-center rounded-xl bg-accent-2 text-white lg:flex">
                <Sparkles size={18} />
              </div>
              <div className="absolute right-10 top-40 hidden h-9 w-9 rotate-3 items-center justify-center rounded-xl bg-surface3 text-text-dim lg:flex">
                <Wand2 size={16} />
              </div>
              <div className="absolute right-48 top-48 hidden h-9 w-9 -rotate-3 items-center justify-center rounded-xl bg-surface3 text-text-dim lg:flex">
                <Clapperboard size={16} />
              </div>

              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1 text-xs font-semibold text-text-dim">
                <Sparkles size={12} className="text-warn" />
                {totalEntries !== null ? `${totalEntries} entries across the platform` : "Loading platform stats..."}
              </span>

              <h1 className="font-display max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                Manage every corner of <span className="text-accent">The AI Signal</span>.
              </h1>
              <p className="mb-7 mt-4 max-w-md text-sm leading-relaxed text-text-dim">
                Publish tools, moderate content, and keep the AI Discovery platform running smoothly — all from one dashboard.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/tools"
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6b5ce6]"
                >
                  Browse AI Tools <ArrowRight size={14} />
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface2 px-4 py-2.5 text-sm font-semibold text-text hover:bg-surface3"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Module grid */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Manage your modules</h2>
                <p className="mt-1 text-sm text-text-dim">Jump into any part of the platform, ready to edit.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {ENTITY_SLUGS.map((slug) => {
                const Icon = ENTITY_ICONS[slug];
                const colors = avatarStyle(slug);
                const featured = FEATURED_SLUGS.includes(slug);
                return (
                  <Link
                    key={slug}
                    href={`/admin/${slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/40"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: colors.bg, color: colors.text }}
                      >
                        <Icon size={18} />
                      </div>
                      {featured && (
                        <span className="rounded-full border border-warn/30 bg-warn/10 px-2.5 py-0.5 text-[11px] font-semibold text-warn">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1.5 font-display text-base font-bold" style={{ color: colors.bg }}>
                      {ENTITY_REGISTRY[slug].label}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-text-dim">{MODULE_DESCRIPTIONS[slug]}</p>

                    <div className="mt-auto flex items-center justify-between text-sm">
                      <span className="font-mono text-text-dim">
                        {data ? data.counts[slug] : "—"} entries
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-text-dim group-hover:text-accent">
                        Manage <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}