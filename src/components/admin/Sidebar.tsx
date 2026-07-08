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
        "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors",
        active ? "bg-accent/10 text-accent" : "text-text-dim hover:bg-surface2 hover:text-text"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    // Reserves a fixed 64px rail in the layout; the actual panel is an
    // absolutely positioned overlay that expands on hover, so hovering
    // doesn't push or reflow the page content next to it.
    <div className="group/sidebar relative h-full w-16 shrink-0 max-lg:hidden">
      <aside className="absolute left-0 top-0 z-30 flex h-full w-16 flex-col overflow-hidden border-r border-border bg-surface p-2.5 shadow-none transition-all duration-200 ease-out group-hover/sidebar:w-64 group-hover/sidebar:shadow-2xl">
        <div className="flex items-center gap-2 px-2 py-2 pb-5">
          <div className="h-[26px] w-[26px] shrink-0 rounded-md bg-gradient-to-br from-accent to-accent-2" />
          <span className="font-display whitespace-nowrap text-sm font-bold opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
            Signal Admin
          </span>
        </div>

        <div className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
          <NavItem href="/admin" active={pathname === "/admin"} icon={LayoutDashboard} label="Dashboard" />

          <div className="whitespace-nowrap px-2.5 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
            Content
          </div>
          {ENTITY_SLUGS.map((slug) => (
            <NavItem
              key={slug}
              href={`/admin/${slug}`}
              active={pathname === `/admin/${slug}`}
              icon={ENTITY_ICONS[slug]}
              label={ENTITY_REGISTRY[slug].label}
            />
          ))}

          <div className="whitespace-nowrap px-2.5 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-wide text-text-faint opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
            Insights
          </div>
          <NavItem href="/admin/analytics" active={pathname === "/admin/analytics"} icon={BarChart3} label="Analytics" />
        </div>
      </aside>
    </div>
  );
}