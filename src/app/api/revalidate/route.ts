import { revalidateTag } from "next/cache";
import { COLUMNS_TAG, columnTag } from "@/features/columns/api/wordpress";

/**
 * WordPress（mu-plugin）から記事更新時に呼ばれる Webhook。
 * curl -X POST localhost:3000/api/revalidate -H "Authorization: Bearer dev-secret" \
 *   -H "Content-Type: application/json" -d '{"slug":"remote-work"}'
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { slug?: unknown };

  // 'max' = stale-while-revalidate（古いキャッシュを返しつつ裏で再生成）
  revalidateTag(COLUMNS_TAG, "max");
  if (typeof body.slug === "string" && body.slug) {
    revalidateTag(columnTag(body.slug), "max");
  }

  return Response.json({ revalidated: true, now: Date.now() });
}
