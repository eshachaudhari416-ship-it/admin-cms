"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogIn, ChevronDown, LogOut, Settings, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

// Purely a UI element for now — Module 11 (Auth) owns the real session.
// Clicking "Log in" goes to the placeholder /login page; once real auth
// ships, swap the `loggedIn` check for an actual session/cookie read.
export function Topbar({ title }: { title: string }) {
  const [loggedIn, setLoggedIn] = useState(true); // defaults to signed-in view for demo purposes
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3.5 sm:h-[58px] sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="shrink-0 rounded-lg p-2 text-text-dim hover:bg-surface3 hover:text-text lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <div className="hidden text-[11px] text-text-faint sm:block">Admin CMS</div>
            <div className="font-display truncate text-sm font-bold">{title}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <button className="hidden rounded-lg p-2 text-text-dim hover:bg-surface3 hover:text-text sm:block">
            <Bell size={16} />
          </button>

          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-1.5 hover:bg-surface2 sm:pr-2"
              >
                <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-danger text-xs font-bold">
                  AM
                </div>
                <ChevronDown size={13} className="hidden text-text-faint sm:block" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-20 w-48 rounded-lg border border-border bg-surface p-1.5 shadow-lg">
                  <div className="border-b border-border px-2.5 py-2">
                    <div className="text-sm font-semibold">Admin</div>
                    <div className="text-xs text-text-faint">admin@example.com</div>
                  </div>
                  <Link
                    href="/admin"
                    className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-text-dim hover:bg-surface2 hover:text-text"
                  >
                    <Settings size={14} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      setLoggedIn(false);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-danger hover:bg-danger/10"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#6b5ce6] sm:px-3.5"
            >
              <LogIn size={14} /> <span className="hidden sm:inline">Log in</span>
            </Link>
          )}
        </div>
      </div>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}