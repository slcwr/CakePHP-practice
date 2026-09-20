import { z } from "zod";
import { JOB_CATEGORIES } from "@/types/job";
import type { Job, JobSearchResult } from "@/types/job";

/**
 * 求人 API（CakePHP）のレスポンス定義。
 * API は snake_case で返すので、ここで検証しつつ camelCase の型に変換する。
 */
export const apiJobSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    category: z.enum(Object.keys(JOB_CATEGORIES) as [keyof typeof JOB_CATEGORIES]),
    location: z.string(),
    remote: z.boolean(),
    salary_min: z.number(),
    salary_max: z.number(),
    skills: z.array(z.string()),
    description: z.string(),
    published_at: z.string(),
  })
  .transform(
    ({ salary_min, salary_max, published_at, ...rest }): Job => ({
      ...rest,
      salaryMin: salary_min,
      salaryMax: salary_max,
      publishedAt: published_at,
    }),
  );

/** GET /jobs（検索・ids 指定）のレスポンス。ids 指定のときは page / total_pages が返らない */
export const searchResultSchema = z
  .object({
    items: z.array(apiJobSchema),
    total: z.number(),
    page: z.number().optional(),
    total_pages: z.number().optional(),
  })
  .transform(
    ({ items, total, page, total_pages }): JobSearchResult => ({
      items,
      total,
      page: page ?? 1,
      totalPages: total_pages ?? 1,
    }),
  );

/** GET /jobs/ids のレスポンス（generateStaticParams 用） */
export const idsSchema = z.object({ ids: z.array(z.string()) });
