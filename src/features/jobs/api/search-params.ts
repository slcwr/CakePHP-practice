import { JOB_CATEGORIES, type JobCategory, type JobSearchParams } from "@/features/jobs/types";

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const isCategory = (v: string | undefined): v is JobCategory =>
  v !== undefined && Object.hasOwn(JOB_CATEGORIES, v);

/** URL の searchParams を型安全な検索条件に変換する */
export function parseJobSearchParams(raw: RawParams): JobSearchParams {
  const keyword = first(raw.keyword)?.slice(0, 50);
  const category = first(raw.category);
  const page = Number(first(raw.page));

  return {
    keyword: keyword || undefined,
    category: isCategory(category) ? category : undefined,
    remote: first(raw.remote) === "1",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** 検索条件を保ったままページ番号だけ差し替えた URL を作る */
export function buildJobsUrl(params: JobSearchParams, page: number): string {
  const sp = new URLSearchParams();
  if (params.keyword) sp.set("keyword", params.keyword);
  if (params.category) sp.set("category", params.category);
  if (params.remote) sp.set("remote", "1");
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}
