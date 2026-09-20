import Form from "next/form";
import { JOB_CATEGORIES, type JobSearchParams } from "@/features/jobs/types";
import styles from "./JobSearchForm.module.css";

type Props = {
  defaultValues?: JobSearchParams;
};

/**
 * next/form を使った検索フォーム。
 * - JS 無効でも GET /jobs?keyword=... として動く（プログレッシブエンハンスメント）
 * - JS 有効ならクライアントサイド遷移 + loading.tsx の prefetch
 * そのため "use client" 不要（Server Component のまま）
 */
export function JobSearchForm({ defaultValues = {} }: Props) {
  return (
    <Form action="/jobs" className={styles.form} role="search">
      <label className={styles.field}>
        <span className={styles.label}>キーワード</span>
        <input
          type="search"
          name="keyword"
          placeholder="例：Next.js、Laravel"
          defaultValue={defaultValues.keyword}
          className={styles.input}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>職種</span>
        <select
          name="category"
          defaultValue={defaultValues.category ?? ""}
          className={styles.input}
        >
          <option value="">すべて</option>
          {Object.entries(JOB_CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.check}>
        <input type="checkbox" name="remote" value="1" defaultChecked={defaultValues.remote} />
        フルリモート可のみ
      </label>
      <button type="submit" className={styles.submit}>
        検索する
      </button>
    </Form>
  );
}
