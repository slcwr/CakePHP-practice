import type { Metadata } from "next";
import { Header } from "@/shared/components/Header/Header";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | IT転職ナビ（練習用）",
    default: "IT転職ナビ（練習用）",
  },
  description: "Next.js App Router + ヘッドレス WordPress の練習用求人サイト",
};

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"], // デザインで使われているウェイトだけ指定する
  variable: "--font-base", // globals.css の body から参照する
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
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
