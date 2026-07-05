"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { ENTITY_ICONS } from "./entityIcons";

function NavItem({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon
        size={18}
        className={clsx(
          active
            ? "text-white"
            : "text-slate-500 group-hover:text-white"
        )}
      />

      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-800 bg-[#0B1220] px-5 py-6">

      {/* Logo */}

      <div className="mb-10 flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">

          <Sparkles className="text-white" size={22} />

        </div>

        <div>

          <h2 className="text-lg font-bold text-white">
            Signal Admin
          </h2>

          <p className="text-xs text-slate-500">
            CMS Dashboard
          </p>

        </div>

      </div>

      {/* Dashboard */}

      <div className="space-y-2">

        <NavItem
          href="/admin"
          active={pathname === "/admin"}
          icon={LayoutDashboard}
          label="Dashboard"
        />

      </div>

      {/* Categories */}

      <div className="mt-10">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Categories
        </p>

        <div className="space-y-2">

          {ENTITY_SLUGS.map((slug) => (
            <NavItem
              key={slug}
              href={`/admin/${slug}`}
              active={pathname === `/admin/${slug}`}
              icon={ENTITY_ICONS[slug]}
              label={ENTITY_REGISTRY[slug].label}
            />
          ))}

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-auto border-t border-slate-800 pt-6">

        <NavItem
          href="/admin/analytics"
          active={pathname === "/admin/analytics"}
          icon={BarChart3}
          label="Analytics"
        />

      </div>

    </aside>
  );
}