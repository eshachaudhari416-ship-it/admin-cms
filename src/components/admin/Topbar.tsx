"use client";

import { Bell } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-border px-5">
      <div>
        <div className="text-[11px] text-text-faint">Admin CMS</div>
        <div className="font-display text-sm font-bold">{title}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="rounded-lg p-2 text-text-dim hover:bg-surface3 hover:text-text">
          <Bell size={16} />
        </button>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-danger text-xs font-bold">
          AM
        </div>
      </div>
    </div>
  );
}
