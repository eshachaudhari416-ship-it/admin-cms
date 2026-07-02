"use client";

import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  label,
  busy,
  onCancel,
  onConfirm,
}: {
  label: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal onClose={onCancel} width={380}>
      <div className="p-5">
        <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-danger/10">
          <Trash2 size={16} className="text-danger" />
        </div>
        <h3 className="font-display mb-1.5 text-[15px] font-bold">Delete &ldquo;{label}&rdquo;?</h3>
        <p className="mb-4 text-sm text-text-dim">This can&rsquo;t be undone. The entry will be permanently removed.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
