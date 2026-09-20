import { describe, expect, it } from "vitest";
import { buildJobsUrl, parseJobSearchParams } from "@/features/jobs/api/search-params";

describe("parseJobSearchParams", () => {
  it("不正な値は無視する", () => {
    expect(parseJobSearchParams({ category: "unknown", page: "-1", remote: "yes" })).toEqual({
      keyword: undefined,
      category: undefined,
      remote: false,
      page: 1,
    });
  });

  it("配列で来た場合は先頭を使う", () => {
    expect(
      parseJobSearchParams({
        keyword: ["React", "Vue"],
        category: "engineer",
        remote: "1",
        page: "2",
      }),
    ).toEqual({
      keyword: "React",
      category: "engineer",
      remote: true,
      page: 2,
    });
  });
});

describe("buildJobsUrl", () => {
  it("検索条件を保持してページを付与する", () => {
    expect(buildJobsUrl({ keyword: "Next.js", remote: true }, 2)).toBe(
      "/jobs?keyword=Next.js&remote=1&page=2",
    );
  });

  it("1ページ目は page を付けない", () => {
    expect(buildJobsUrl({}, 1)).toBe("/jobs");
  });
});
