import Link from "next/link";
import styles from "./Pagination.module.css";

type Props = {
  current: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

export function Pagination({ current, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="ページ送り" className={styles.pagination}>
      {pages.map((page) =>
        page === current ? (
          <span key={page} aria-current="page" className={`${styles.item} ${styles.current}`}>
            {page}
          </span>
        ) : (
          <Link key={page} href={hrefFor(page)} className={styles.item}>
            {page}
          </Link>
        ),
      )}
    </nav>
  );
}
