"use client";

import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import styles from "./FavoriteButton.module.css";

type Props = {
  jobId: string;
  size?: "sm" | "md";
};

/** Server Component の中に島（island）として置く Client Component */
export function FavoriteButton({ jobId, size = "md" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(jobId);

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[size]}`}
      aria-pressed={active}
      onClick={() => toggle(jobId)}
    >
      <span aria-hidden="true">{active ? "★" : "☆"}</span>
      {active ? "お気に入り済み" : "お気に入り"}
    </button>
  );
}
