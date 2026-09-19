# CakePHP-practice

Next.js（App Router）+ TypeScript + CSS Modules + ヘッドレス WordPress で作った、求人サイト風の練習用アプリです。
devcontainer で **Next.js / WordPress / MySQL** がまとめて起動します。

```
┌──────────── devcontainer (docker compose) ────────────┐
│  app (Node 22)          wordpress (PHP 8.3)   db       │
│  Next.js :3000  ──REST──▶ /wp-json/wp/v2  ──▶ MySQL 8.4 │
│  Storybook :6006 ◀─webhook─ mu-plugin                   │
│                          wpcli（初回だけ初期データ投入）  │
└────────────────────────────────────────────────────────┘
```

## 起動手順

前提：Docker Desktop と VS Code の拡張機能「Dev Containers」

1. VS Code でこのフォルダを開く → コマンドパレット → **Dev Containers: Reopen in Container**
2. 初回は `npm ci` まで自動で実行されます（数分）
3. コンテナ内のターミナルで

```bash
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
npm test             # Vitest
npm run lint && npm run typecheck
```

- WordPress 管理画面：http://localhost:8080/wp-admin （`admin` / `admin`）
- 初期データ投入のログ：ホスト側で `docker compose -p geekly-practice logs wpcli`
- WordPress を作り直したいとき：コンテナを閉じてから `docker compose -p geekly-practice down -v`

> Docker で WordPress が起動できない場合は `npm run mock:wp` で WP REST API のモック（:8081）を立て、
> `WORDPRESS_API_URL=http://localhost:8081/wp-json/wp/v2 npm run dev` で起動できます。

### ISR / オンデマンド再検証を体験する

`next dev` はキャッシュの挙動が本番と違うので、本番ビルドで確認します。

```bash
npm run build && npm start
```

1. http://localhost:3000/columns を開く
2. WordPress 管理画面で記事タイトルを変更して「更新」
3. mu-plugin（`wordpress/mu-plugins/next-revalidate.php`）が `POST /api/revalidate` を呼ぶ
4. `revalidateTag('columns', 'max')` → 次のアクセスで再生成され、その次から新しい内容が表示される

## 画面とレンダリング手法

`npm run build` の出力でも `○ Static / ● SSG / ƒ Dynamic` が確認できます。

| URL                           | 手法                       | ポイント                                                                                 |
| ----------------------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                           | 静的 + ISR(60s) + Suspense | 遅いデータを `<Suspense>` で分割してストリーミング。CMS 障害時もページは落とさない       |
| `/jobs`                       | SSR（動的）                | `searchParams` を読むので毎リクエスト描画。検索フォームは `next/form`（JS 無効でも動く） |
| `/jobs/[id]`                  | SSG + ISR(300s)            | `generateStaticParams` / `generateMetadata` / `notFound()`。`cache()` で重複取得を防止   |
| `/favorites`                  | CSR                        | localStorage はブラウザにしかないので Client Component で `/api/jobs` を fetch           |
| `/columns`, `/columns/[slug]` | SSG + ISR + タグ再検証     | WP REST API を `fetch(..., { next: { revalidate, tags } })`                              |
| `/contact`                    | SSR + Server Action        | `useActionState` + zod でバリデーション。エラー時は入力値を保持                          |
| `/api/jobs`                   | Route Handler              | RESTful な BFF エンドポイント                                                            |
| `/api/revalidate`             | Route Handler              | WordPress からの Webhook。Bearer トークンで認証                                          |

**RSC と Client Component の境界**：`FavoriteButton` だけが `"use client"`。`JobCard` 自体は Server Component のまま、
中にクライアントの「島」を置いています。状態は `useSyncExternalStore` で localStorage と同期（SSR 時は空配列 → ハイドレーションエラーなし、別タブとも同期）。

## ディレクトリ構成

```
.devcontainer/         devcontainer.json / compose.yaml
wordpress/             setup.sh（wp-cli で初期化）/ mu-plugins（再検証 Webhook）
scripts/mock-wp.mjs    WP REST API のモック
src/
  app/                 ルーティング（App Router）
  components/          UI（CSS Modules / *.test.tsx / *.stories.tsx を同じ場所に配置）
  hooks/useFavorites   CSR 用の状態
  lib/jobs.ts          求人データアクセス層（本来はバックエンド API）
  lib/wordpress.ts     WordPress クライアント（server-only）
  types/
```

## 練習課題（改修チケット風）

実案件は「常時20件程度の改修」なので、1件 30〜60 分想定で手を動かしてみてください。

1. コラム一覧にカテゴリ絞り込みを追加（`/wp/v2/posts?categories=ID`、`/wp/v2/categories`）
2. コラム一覧にページネーション（レスポンスヘッダ `X-WP-TotalPages` を利用）
3. 求人一覧に「年収○万円以上」フィルタを追加し、`filterJobs` のテストも追加
4. 求人詳細に JSON-LD（`JobPosting`）を出力して SEO 対応
5. WordPress の下書きプレビューを Draft Mode で実装（`/api/draft`）
6. 検索キーワード入力をデバウンスしてインクリメンタルサーチ（`useRouter` + `useTransition`）
7. `FavoriteJobList` を SWR / TanStack Query に置き換え
8. `SkillTag` にサイズ variant を追加して Storybook に反映
9. Playwright で「検索 → お気に入り → お気に入り一覧」の E2E テスト
10. `next.config.ts` の `rewrites` で、未移行のページを既存（CakePHP 想定）サーバーへ流すストラングラーパターンを試す

## 面談で話せるポイント

**CSR / SSR / RSC の使い分け**

- 基本は Server Component（JS を送らない・データ取得がサーバーで完結・秘密情報を扱える）
- ユーザー操作・ブラウザ API が必要な最小単位だけ Client Component にする
- 更新頻度で静的（SSG/ISR）か動的（SSR）かを決める。求人詳細やコラムは ISR、検索結果は SSR、ユーザー固有のお気に入りは CSR
- CMS 記事は時間ベース ISR だけだと反映が遅れるので、Webhook でタグ単位のオンデマンド再検証を併用

**Next.js のバージョン差分（このリポジトリは 16 系）**

- 15〜：`params` / `searchParams` / `cookies()` が Promise に。`fetch` はデフォルトでキャッシュされない
- 16：`revalidateTag(tag, profile)` の2引数化、`middleware` → `proxy` へ改名、`cacheComponents`（`"use cache"`）が導入
- 既存案件が 14 系なら、キャッシュのデフォルト挙動の違いに注意してアップデートする

**ヘッドレス WordPress**

- 長所：編集者は使い慣れた管理画面のまま、フロントは Next.js でパフォーマンス・開発体験を上げられる
- 注意点：プレビュー（Draft Mode）、キャッシュ無効化、`dangerouslySetInnerHTML` の XSS 対策、ACF などのカスタムフィールド型定義、WP 側障害時のフォールバック

**レガシーリプレイス**

- 一気に置き換えず、ページ単位で Next.js に移し、残りは `rewrites` で旧システムへ（ストラングラーパターン）
- CakePHP のコントローラ／ビューを読んで、画面ごとの入出力と副作用を洗い出してから API 化

**AI ツール（Copilot）活用**

- テストケースの洗い出し・Storybook のバリエーション作成・型定義の生成など定型作業を任せる
- 生成コードは「Server/Client 境界」「キャッシュ設定」「アクセシビリティ」を中心に必ずレビュー
- `AGENTS.md` のように、フレームワークのバージョン固有ルールを AI に渡す工夫
