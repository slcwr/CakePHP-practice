import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getColumnBySlug, getColumns } from "@/lib/wordpress";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

export async function generateStaticParams() {
  try {
    const { items } = await getColumns({ perPage: 100 });
    return items.map((c) => ({ slug: c.slug }));
  } catch {
    // ビルド時に WordPress に繋がらなくても、アクセス時に生成すればよい
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/columns/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const column = await getColumnBySlug(decodeURIComponent(slug)); // fetch は同一リクエスト内で自動 dedupe
  if (!column) return {};
  return { title: column.title, description: column.excerpt };
}

export default async function ColumnDetailPage({ params }: PageProps<"/columns/[slug]">) {
  const { slug } = await params;
  const column = await getColumnBySlug(decodeURIComponent(slug));
  if (!column) notFound();

  return (
    <div className="container">
      <p className="muted" style={{ marginBottom: 8 }}>
        <Link href="/columns" className="textLink">
          転職コラム
        </Link>
      </p>
      <article className={styles.article}>
        <h1 className={styles.title}>{column.title}</h1>
        <p className="muted">
          <time dateTime={column.date}>{formatDate(column.date)}</time>
          {column.categories.length > 0 && ` ・ ${column.categories.map((c) => c.name).join(", ")}`}
        </p>
        {/*
          WordPress の本文 HTML をそのまま描画。
          管理者のみが入稿する前提。外部入力が混ざるなら sanitize-html / DOMPurify でサニタイズする。
        */}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: column.contentHtml }} />
      </article>
    </div>
  );
}
