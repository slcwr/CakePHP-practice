"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "favorite-job-ids";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cache: { raw: string | null; ids: string[] } = { raw: null, ids: EMPTY };

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  // useSyncExternalStore は同じ参照を返さないと無限ループになるのでキャッシュする
  if (raw !== cache.raw) {
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cache = {
        raw,
        ids: Array.isArray(parsed)
          ? parsed.filter((v): v is string => typeof v === "string")
          : EMPTY,
      };
    } catch {
      cache = { raw, ids: EMPTY };
    }
  }
  return cache.ids;
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // プライベートモード等では保存できないので無視
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 別タブでの変更にも追従
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** localStorage に保存するお気に入り求人（CSR 専用の状態） */
export function useFavorites() {
  // サーバーでは常に空配列 → ハイドレーションエラーを防ぐ
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((v) => v !== id) : [...current, id]);
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isFavorite };
}
