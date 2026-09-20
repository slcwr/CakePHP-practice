"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Job } from "@/features/jobs/types";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { JobCard } from "@/features/jobs/components/JobCard/JobCard";

type State = { status: "loading" } | { status: "success"; jobs: Job[] } | { status: "error" };

/**
 * CSR の例：お気に入りはブラウザ（localStorage）にしかないので、
 * クライアントで Route Handler (/api/jobs) を叩いて取得する。
 * 実案件なら SWR / TanStack Query を使うとキャッシュや再検証が楽になる。
 */
export function FavoriteJobList() {
  const { ids } = useFavorites();
  const [state, setState] = useState<State>({ status: "loading" });
  const key = ids.join(",");

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();

    fetch(`/api/jobs?ids=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ items: Job[] }>;
      })
      .then((data) => setState({ status: "success", jobs: data.items }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });

    // ids が変わったら前のリクエストを捨てる（レースコンディション対策）
    return () => controller.abort();
  }, [key]);

  if (!key) {
    return (
      <p>
        お気に入りはまだありません。<Link href="/jobs">求人を探す</Link>
      </p>
    );
  }
  if (state.status === "loading") return <p aria-busy="true">読み込み中…</p>;
  if (state.status === "error") return <p role="alert">取得に失敗しました。</p>;

  // 取得後に解除された求人は即時に非表示にする
  const visible = state.jobs.filter((job) => ids.includes(job.id));
  return (
    <ul className="stack">
      {visible.map((job) => (
        <li key={job.id}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}
