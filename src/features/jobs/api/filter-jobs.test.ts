import { describe, expect, it } from "vitest";
import { filterJobs, PER_PAGE } from "@/features/jobs/api/filter-jobs";
import { jobs } from "@/features/jobs/fixtures";

describe("filterJobs", () => {
  it("条件なしなら全件を1ページ目から返す", () => {
    const result = filterJobs(jobs, {});
    expect(result.total).toBe(jobs.length);
    expect(result.items).toHaveLength(PER_PAGE);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(Math.ceil(jobs.length / PER_PAGE));
  });

  it("キーワードはタイトル・スキルを大文字小文字を区別せず検索する", () => {
    const result = filterJobs(jobs, { keyword: "next.js" });
    expect(result.total).toBeGreaterThan(0);
    for (const job of result.items) {
      expect([job.title, ...job.skills].join(" ").toLowerCase()).toContain("next.js");
    }
  });

  it("カテゴリとリモートで絞り込める", () => {
    const result = filterJobs(jobs, { category: "engineer", remote: true, page: 1 });
    expect(result.items.every((j) => j.category === "engineer" && j.remote)).toBe(true);
  });

  it("範囲外のページ番号は最終ページに丸める", () => {
    const result = filterJobs(jobs, { page: 999 });
    expect(result.page).toBe(result.totalPages);
  });

  it("該当なしでも totalPages は 1", () => {
    const result = filterJobs(jobs, { keyword: "存在しないキーワード" });
    expect(result).toMatchObject({ total: 0, items: [], totalPages: 1, page: 1 });
  });
});
