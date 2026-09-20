import { Suspense } from "react";
import Link from "next/link";
import { getLatestJobs } from "@/features/jobs/api/jobs";
import { getColumns } from "@/features/columns/api/wordpress";
import { JobCard } from "@/features/jobs/components/JobCard/JobCard";
import { ColumnCard } from "@/features/columns/components/ColumnCard/ColumnCard";
import { JobSearchForm } from "@/features/jobs/components/JobSearchForm/JobSearchForm";
import styles from "./page.module.css";

// トップページ：静的生成 + ISR（60秒）。
// 遅いデータは Suspense で分割してストリーミングする。
export const revalidate = 60;

async function LatestJobs() {
  const jobs = await getLatestJobs(3);
  return (
    <ul className="stack">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}

async function LatestColumns() {
  // CMS が落ちていてもトップページ全体は落とさない
  const columns = await getColumns({ perPage: 3 })
    .then((res) => res.items)
    .catch(() => null);

  if (!columns) {
    return <p className="muted">コラムを取得できませんでした。</p>;
  }
  return (
    <ul className={styles.columns}>
      {columns.map((column) => (
        <li key={column.id}>
          <ColumnCard column={column} />
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            IT・Web・ゲーム業界の
            <br />
            転職ならおまかせ
          </h1>
          <p className={styles.heroLead}>
            Next.js App Router + ヘッドレス WordPress の練習用デモサイトです。
          </p>
          <JobSearchForm />
        </div>
      </section>

      <div className="container">
        <h2 className="sectionTitle">新着求人</h2>
        <Suspense fallback={<p className="muted">求人を読み込み中…</p>}>
          <LatestJobs />
        </Suspense>
        <p style={{ marginTop: 16 }}>
          <Link href="/jobs" className="textLink">
            求人をすべて見る →
          </Link>
        </p>

        <h2 className="sectionTitle">転職コラム（WordPress）</h2>
        <Suspense fallback={<p className="muted">コラムを読み込み中…</p>}>
          <LatestColumns />
        </Suspense>
      </div>
    </>
  );
}
