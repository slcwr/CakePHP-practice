import type { Metadata } from "next";
import { FavoriteJobList } from "@/components/FavoriteJobList/FavoriteJobList";

export const metadata: Metadata = {
  title: "お気に入り求人",
};

// ページの枠は静的。中身はクライアントで取得（CSR）
export default function FavoritesPage() {
  return (
    <div className="container">
      <h1 className="pageTitle">お気に入り求人</h1>
      <FavoriteJobList />
    </div>
  );
}
