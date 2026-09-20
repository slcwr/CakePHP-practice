import type { NextRequest } from "next/server";
import { getJobsByIds, searchJobs } from "@/features/jobs/api/jobs";
import { parseJobSearchParams } from "@/features/jobs/api/search-params";

/**
 * GET /api/jobs?ids=1001,1002       → 指定IDの求人
 * GET /api/jobs?keyword=Next.js&page=2 → 検索
 * クライアント（CSR）や外部から使う RESTful なエンドポイント（BFF）
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const ids = sp.get("ids");

  if (ids !== null) {
    const list = ids.split(",").filter(Boolean).slice(0, 50);
    const items = await getJobsByIds(list);
    return Response.json({ items, total: items.length });
  }

  const result = await searchJobs(parseJobSearchParams(Object.fromEntries(sp)));
  return Response.json(result);
}
