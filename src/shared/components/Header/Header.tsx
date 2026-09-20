import Link from "next/link";
import styles from "./Header.module.css";

const NAV = [
  { href: "/jobs", label: "求人を探す" },
  { href: "/columns", label: "転職コラム" },
  { href: "/favorites", label: "お気に入り" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          IT転職ナビ<span className={styles.badge}>練習用</span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className={styles.cta}>
                無料転職相談
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
