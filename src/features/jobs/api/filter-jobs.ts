import type { Job, JobSearchParams, JobSearchResult } from "@/features/jobs/types";

/** 1ページあたりの件数（CakePHP 側の JobsTable::PER_PAGE と合わせる） */
export const PER_PAGE = 5;

/**
 * 純粋関数としての検索ロジック（ユニットテスト対象）。
 * 本番の検索は API 側（JobsTable::findSearch）が担当するので、
 * ここは仕様の確認とテスト、API を使わない場合のフォールバック用。
 */
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
