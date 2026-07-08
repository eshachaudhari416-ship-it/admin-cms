"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, X } from "lucide-react";
import clsx from "clsx";
import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { ENTITY_ICONS } from "./entityIcons";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  if (!open) return null;

  function NavRow({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        className={clsx(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold",
          active ? "bg-accent/10 text-accent" : "text-text-dim hover:bg-surface2 hover:text-text"
        )}
      >
        <Icon size={17} />
        {label}
      </Link>
    );
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col overflow-y-auto border-r border-border bg-surface p-3">
        <div className="mb-2 flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="h-[26px] w-[26px] shrink-0 rounded-md bg-gradient-to-br from-accent to-accent-2" />
            <span className="font-display text-sm font-bold">Signal Admin</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-dim hover:bg-surface2 hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <NavRow href="/admin" icon={LayoutDashboard} label="Dashboard" />

          <div className="px-3 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint">Content</div>
          {ENTITY_SLUGS.map((slug) => (
            <NavRow key={slug} href={`/admin/${slug}`} icon={ENTITY_ICONS[slug]} label={ENTITY_REGISTRY[slug].label} />
          ))}

          <div className="px-3 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint">Insights</div>
          <NavRow href="/admin/analytics" icon={BarChart3} label="Analytics" />
        </div>
      </div>
    </div>
  );
}