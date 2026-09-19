import "server-only";
import type { Column, WPPost } from "@/types/wordpress";
import { stripHtml } from "@/lib/format";

const API_URL = process.env.WORDPRESS_API_URL ?? "http://localhost:8080/wp-json/wp/v2";

/** キャッシュタグ。/api/revalidate から revalidateTag される */
export const COLUMNS_TAG = "columns";
export const columnTag = (slug: string) => `column:${slug}`;

export class WordPressError extends Error {}

async function wpFetch<T>(path: string, tags: string[]): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(`${API_URL}${path}`, {
    // ISR: 60秒ごとに再検証 + WordPress 側からのオンデマンド再検証
    next: { revalidate: 60, tags },
  });
  if (!res.ok) {
    throw new WordPressError(`WordPress API error: ${res.status} ${path}`);
  }
  return { data: (await res.json()) as T, headers: res.headers };
}

function toColumn(post: WPPost): Column {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    contentHtml: post.content.rendered,
    date: post.date,
    categories: terms
      .filter((t) => t.taxonomy === "category")
      .map(({ name, slug }) => ({ name, slug })),
  };
}

export async function getColumns({ perPage = 10, page = 1 } = {}) {
  const { data, headers } = await wpFetch<WPPost[]>(
    `/posts?_embed=wp:term&per_page=${perPage}&page=${page}`,
    [COLUMNS_TAG],
  );
  return {
    items: data.map(toColumn),
    totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
  };
}

export async function getColumnBySlug(slug: string): Promise<Column | undefined> {
  const { data } = await wpFetch<WPPost[]>(
    `/posts?_embed=wp:term&slug=${encodeURIComponent(slug)}`,
    [COLUMNS_TAG, columnTag(slug)],
  );
  return data[0] ? toColumn(data[0]) : undefined;
}
