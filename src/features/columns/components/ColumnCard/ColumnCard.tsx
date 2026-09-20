import Link from "next/link";
import type { Column } from "@/features/columns/types";
import { formatDate } from "@/shared/lib/format";
import { SkillTag } from "@/shared/components/SkillTag/SkillTag";
import styles from "./ColumnCard.module.css";

export function ColumnCard({ column }: { column: Column }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        {column.categories.map((c) => (
          <SkillTag key={c.slug} label={c.name} variant="highlight" />
        ))}
        <time dateTime={column.date} className={styles.date}>
          {formatDate(column.date)}
        </time>
      </div>
      <h3 className={styles.title}>
        <Link href={`/columns/${column.slug}`}>{column.title}</Link>
      </h3>
      <p className={styles.excerpt}>{column.excerpt}</p>
    </article>
  );
}
