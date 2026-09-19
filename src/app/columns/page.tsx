import type { Metadata } from "next";
import { getColumns } from "@/lib/wordpress";
import { ColumnCard } from "@/components/ColumnCard/ColumnCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "転職コラム",
};

// WordPress REST API から取得。fetch 側で revalidate: 60 + tags を指定（ISR）
export default async function ColumnsPage() {
  const { items } = await getColumns({ perPage: 20 });

  return (
    <div className="container">
      <h1 className="pageTitle">転職コラム</h1>
      {items.length === 0 ? (
        <p className="muted">記事がありません。</p>
      ) : (
        <ul className={styles.grid}>
          {items.map((column) => (
            <li key={column.id}>
              <ColumnCard column={column} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
