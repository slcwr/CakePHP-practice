import "server-only";
import { cache } from "react";
import type { z } from "zod";
import { apiJobSchema, idsSchema, searchResultSchema } from "@/lib/jobs.schema";
import type { Job, JobSearchParams, JobSearchResult } from "@/types/job";

export { PER_PAGE } from "@/lib/filter-jobs";

const API_URL = process.env.JOBS_API_URL ?? "http://localhost:8765";

export class JobsApiError extends Error {}

// ---- CakePHP API（JOBS_API_URL）へのデータアクセス層 ----

type FetchOptions = {
  /** ISR の再検証間隔（秒）。省略時はキャッシュしない */
  revalidate?: number;
};

async function jobsFetch(path: string, { revalidate }: FetchOptions = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      // API が無応答のときにページ全体が待ち続けないよう上限を設ける
      signal: AbortSignal.timeout(5000),
      next: revalidate === undefined ? undefined : { revalidate },
    });
  } catch (cause) {
    throw new JobsApiError(`求人 API に接続できません: ${path}`, { cause });
  }

  // 404 は「該当なし」として呼び出し側で扱うので、ここでは投げない
  if (!res.ok && res.status !== 404) {
    throw new JobsApiError(`求人 API がエラーを返しました: ${res.status} ${path}`);
  }
  return res;
}

async function parseJson<T>(res: Response, schema: z.ZodType<T>, path: string): Promise<T> {
  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) {
    throw new JobsApiError(`求人 API のレスポンス形式が想定と異なります: ${path}`);
  }
  return parsed.data;
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.category) query.set("category", params.category);
  if (params.remote) query.set("remote", "1");
  if (params.page) query.set("page", String(params.page));

  // 検索結果は毎リクエスト最新を返す（/jobs は SSR）
  const path = `/jobs?${query}`;
  return parseJson(await jobsFetch(path), searchResultSchema, path);
}

/** React の cache() で同一リクエスト内の重複呼び出し（generateMetadata と page）を1回にまとめる */
export const getJob = cache(async (id: string): Promise<Job | undefined> => {
  const path = `/jobs/${encodeURIComponent(id)}`;
  const res = await jobsFetch(path, { revalidate: 300 });
  if (res.status === 404) return undefined;
  return parseJson(res, apiJobSchema, path);
});

export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  if (ids.length === 0) return [];

  const path = `/jobs?ids=${encodeURIComponent(ids.join(","))}`;
  const { items } = await parseJson(await jobsFetch(path), searchResultSchema, path);
  return items;
}

export async function getLatestJobs(limit = 3): Promise<Job[]> {
  // API は published_at の新着順に返すので、先頭から必要な件数だけ使う
  const path = "/jobs";
  const { items } = await parseJson(
    await jobsFetch(path, { revalidate: 60 }),
    searchResultSchema,
    path,
  );
  return items.slice(0, limit);
}

export async function getAllJobIds(): Promise<string[]> {
  const path = "/jobs/ids";
  const { ids } = await parseJson(await jobsFetch(path, { revalidate: 300 }), idsSchema, path);
  return ids;
}
