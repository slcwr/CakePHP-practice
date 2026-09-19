import { cache } from "react";
import { jobs } from "@/data/jobs";
import type { Job, JobSearchParams, JobSearchResult } from "@/types/job";

export const PER_PAGE = 5;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 純粋関数としての検索ロジック（ユニットテスト対象） */
export function filterJobs(source: Job[], params: JobSearchParams): JobSearchResult {
  const keyword = params.keyword?.trim().toLowerCase();
  const filtered = source.filter((job) => {
    if (params.category && job.category !== params.category) return false;
    if (params.remote && !job.remote) return false;
    if (keyword) {
      const haystack = [job.title, job.company, job.description, ...job.skills]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);
  const start = (page - 1) * PER_PAGE;

  return {
    items: filtered.slice(start, start + PER_PAGE),
    total: filtered.length,
    page,
    totalPages,
  };
}

// ---- 以下はバックエンド API 呼び出しを模したデータアクセス層 ----
// 実案件では fetch(`${process.env.API_URL}/jobs?...`) に置き換わる想定

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  await sleep(400); // loading.tsx / Suspense の確認用に遅延
  return filterJobs(jobs, params);
}

/** React の cache() で同一リクエスト内の重複呼び出し（generateMetadata と page）を1回にまとめる */
export const getJob = cache(async (id: string): Promise<Job | undefined> => {
  await sleep(100);
  return jobs.find((job) => job.id === id);
});

export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  await sleep(200);
  return ids.flatMap((id) => jobs.find((job) => job.id === id) ?? []);
}

export async function getLatestJobs(limit = 3): Promise<Job[]> {
  await sleep(600);
  return [...jobs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
}

export async function getAllJobIds(): Promise<string[]> {
  return jobs.map((job) => job.id);
}
