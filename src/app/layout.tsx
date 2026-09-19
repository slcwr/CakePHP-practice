import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | IT転職ナビ（練習用）",
    default: "IT転職ナビ（練習用）",
  },
  description: "Next.js App Router + ヘッドレス WordPress の練習用求人サイト",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="container muted" style={{ paddingBlock: 24, fontSize: "0.8rem" }}>
          © IT転職ナビ（練習用デモ）
        </footer>
      </body>
    </html>
  );
}
