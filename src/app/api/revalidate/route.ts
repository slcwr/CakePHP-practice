import { revalidateTag } from "next/cache";
import { COLUMNS_TAG, columnTag } from "@/features/columns/api/wordpress";

/**
 * WordPress（mu-plugin）から記事更新時に呼ばれる Webhook。
 * curl -X POST localhost:3000/api/revalidate -H "Authorization: Bearer dev-secret" \
 *   -H "Content-Type: application/json" -d '{"slug":"remote-work","status":"publish"}'
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { slug?: unknown; status?: unknown };

  // 公開中の更新は 'max' = stale-while-revalidate（古いキャッシュを返しつつ裏で再生成）。
  // 非公開化・ゴミ箱移動などは古い本文を一度も返さないよう即時失効させる。
  // status が無い・不明な場合も安全側に倒して即時失効
  const profile = body.status === "publish" ? "max" : { expire: 0 };

  revalidateTag(COLUMNS_TAG, profile);
  if (typeof body.slug === "string" && body.slug) {
    revalidateTag(columnTag(body.slug), profile);
  }

  return Response.json({ revalidated: true, now: Date.now() });
}
