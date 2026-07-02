"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ViewState = "loading" | "idle" | "empty" | "error";

interface UseEntityDataOptions {
  search: string;
  status: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  page: number;
  pageSize?: number;
}

interface ListResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetches a page of records for `entitySlug` from /api/admin/[entity] and
 * tracks the loading/empty/error/idle states the Definition of Done
 * requires — driven by real network responses, not simulated.
 */
export function useEntityData<T = Record<string, unknown>>(
  entitySlug: string,
  { search, status, sortKey, sortDir, page, pageSize = 8 }: UseEntityDataOptions
) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setViewState("loading");
    setErrorMessage(null);

    const params = new URLSearchParams({
      search,
      status,
      sortKey,
      sortDir,
      page: String(page),
      pageSize: String(pageSize),
    });

    try {
      const res = await fetch(`/api/admin/${entitySlug}?${params.toString()}`);
      const json = await res.json();

      // A stale response from a superseded request — ignore it.
      if (currentRequest !== requestId.current) return;

      if (!res.ok || !json.success) {
        setViewState("error");
        setErrorMessage(json.error ?? "Something went wrong");
        return;
      }

      const data = json.data as ListResponse<T>;
      setRows(data.rows);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setViewState(data.rows.length === 0 ? "empty" : "idle");
    } catch {
      if (currentRequest !== requestId.current) return;
      setViewState("error");
      setErrorMessage("Couldn't reach the server. Check your connection.");
    }
  }, [entitySlug, search, status, sortKey, sortDir, page, pageSize]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { rows, total, totalPages, viewState, errorMessage, refetch };
}
