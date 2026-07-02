"use client";

import { ReactNode } from "react";

export function Modal({ onClose, children, width = 480 }: { onClose: () => void; children: ReactNode; width?: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-2xl border border-border bg-surface"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
