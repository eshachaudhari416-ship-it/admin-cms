"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import clsx from "clsx";
import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { ENTITY_ICONS } from "./entityIcons";

function NavItem({ href, active, icon: Icon, label }: { href: string; active: boolean; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors",
        active ? "bg-accent/10 text-accent" : "text-text-dim hover:bg-surface2 hover:text-text"
      )}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-surface p-2.5 max-lg:hidden">
      <div className="flex items-center gap-2 px-2 py-2 pb-5">
        <div className="h-6.5 w-6.5 shrink-0 rounded-md bg-gradient-to-br from-accent to-accent-2" style={{ width: 26, height: 26 }} />
        <span className="font-display text-sm font-bold">Signal Admin</span>
      </div>

      <div className="flex flex-col gap-0.5 overflow-y-auto">
        <NavItem href="/admin" active={pathname === "/admin"} icon={LayoutDashboard} label="Dashboard" />

        <div className="px-2.5 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint">Content</div>
        {ENTITY_SLUGS.map((slug) => (
          <NavItem
            key={slug}
            href={`/admin/${slug}`}
            active={pathname === `/admin/${slug}`}
            icon={ENTITY_ICONS[slug]}
            label={ENTITY_REGISTRY[slug].label}
          />
        ))}

        <div className="px-2.5 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint">Insights</div>
        <NavItem href="/admin/analytics" active={pathname === "/admin/analytics"} icon={BarChart3} label="Analytics" />
      </div>
    </aside>
  );
}
