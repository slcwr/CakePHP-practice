import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllJobIds, getJob } from "@/features/jobs/api/jobs";
import { formatSalary } from "@/shared/lib/format";
import { JOB_CATEGORIES } from "@/features/jobs/types";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton/FavoriteButton";
import { SkillTag } from "@/shared/components/SkillTag/SkillTag";
import styles from "./page.module.css";

// ビルド時に全求人を静的生成（SSG）。新しい ID はアクセス時に生成される（dynamicParams=true）
export async function generateStaticParams() {
  const ids = await getAllJobIds();
  return ids.map((id) => ({ id }));
}

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id); // cache() 済みなので page 側と合わせても実行は1回
  if (!job) return {};
  return {
    title: `${job.title}（${job.company}）`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  return (
    <div className="container">
      <p className="muted" style={{ marginBottom: 8 }}>
        <Link href="/jobs" className="textLink">
          求人一覧
        </Link>{" "}
        / {JOB_CATEGORIES[job.category]}
      </p>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{job.title}</h1>
          <p className="muted">{job.company}</p>
          <FavoriteButton jobId={job.id} />
        </header>

        <table className={styles.table}>
          <tbody>
            <tr>
              <th scope="row">年収</th>
              <td>{formatSalary(job.salaryMin, job.salaryMax)}</td>
            </tr>
            <tr>
              <th scope="row">勤務地</th>
              <td>
                {job.location}
                {job.remote && "（フルリモート可）"}
              </td>
            </tr>
            <tr>
              <th scope="row">必要スキル</th>
              <td className={styles.skills}>
                {job.skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </td>
            </tr>
            <tr>
              <th scope="row">仕事内容</th>
              <td>{job.description}</td>
            </tr>
          </tbody>
        </table>

        <Link href={`/contact?jobId=${job.id}`} className={styles.cta}>
          この求人について相談する
        </Link>
      </article>
    </div>
  );
}
