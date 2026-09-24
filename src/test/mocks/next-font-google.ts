/**
 * next/font/google は Next.js のビルド時に変換される特別なモジュールで、
 * 素の vitest では動かないため、テスト中はこのスタブに差し替える（vitest.config.mts の alias）。
 * 使うフォントを増やしたら、ここにも追加する。
 */
const stub = () => ({
  className: "font-stub",
  variable: "font-stub-variable",
  style: { fontFamily: "stub" },
});

export const Noto_Sans_JP = stub;
