// Docker で WordPress を起動できないとき用の WP REST API モック（依存なし）
// 使い方: npm run mock:wp → WORDPRESS_API_URL=http://localhost:8081/wp-json/wp/v2 npm run dev
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8081);
const categories = {
  2: { id: 2, name: "転職ノウハウ", slug: "knowhow", taxonomy: "category" },
  3: { id: 3, name: "職種解説", slug: "job-type", taxonomy: "category" },
  4: { id: 4, name: "年収・キャリア", slug: "career", taxonomy: "category" },
};

const raw = [
  [
    "remote-work",
    "フルリモート求人を探すときの注意点",
    4,
    "2026-09-12T10:00:00",
    "<p>フルリモートでは、テキストコミュニケーション力が成果を左右します。</p><h2>確認したいポイント</h2><ul><li>稼働時間の拘束（コアタイム）</li><li>使用ツール（Slack、GitHubなど）</li></ul>",
  ],
  [
    "web-director",
    "Webディレクターとは？エンジニアとの違い",
    3,
    "2026-09-10T10:00:00",
    "<p>Webディレクターは、サイト制作・運用の進行管理と品質管理を担います。</p>",
  ],
  [
    "interview-questions",
    "面接でよく聞かれる質問と回答例",
    2,
    "2026-09-08T10:00:00",
    "<p>技術面接では経験の深さが問われます。</p><h2>よくある質問</h2><ul><li>これまでで一番難しかった技術課題は？</li></ul>",
  ],
  [
    "salary-negotiation",
    "年収交渉で失敗しないための3つのポイント",
    4,
    "2026-09-05T10:00:00",
    "<p>年収交渉はタイミングと根拠が重要です。</p><h2>1. 市場価値を把握する</h2><p>同じスキルセットの求人の年収レンジを調べましょう。</p>",
  ],
  [
    "frontend-engineer",
    "フロントエンドエンジニアの仕事内容と必要スキル",
    3,
    "2026-09-03T10:00:00",
    "<p>フロントエンドエンジニアは、ユーザーが直接触れるUIを実装する職種です。</p><h2>主な技術スタック</h2><ul><li>TypeScript</li><li>Next.js</li></ul>",
  ],
  [
    "portfolio-tips",
    "エンジニア転職で評価されるポートフォリオの作り方",
    2,
    "2026-09-01T10:00:00",
    "<p>ポートフォリオは「何を作ったか」よりも「なぜそう作ったか」が見られます。</p>",
  ],
];

const posts = raw.map(([slug, title, cat, date, content], i) => ({
  id: 100 + i,
  slug,
  date,
  modified: date,
  link: `http://localhost:${PORT}/${slug}/`,
  title: { rendered: title },
  excerpt: { rendered: `<p>${content.replace(/<[^>]*>/g, "").slice(0, 60)}&hellip;</p>\n` },
  content: { rendered: content },
  categories: [cat],
  _embedded: { "wp:term": [[categories[cat]], []] },
}));

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  console.log(req.method, url.pathname + url.search);

  if (url.pathname.replace(/\/$/, "") !== "/wp-json/wp/v2/posts") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ code: "rest_no_route" }));
  }

  const slug = url.searchParams.get("slug");
  const perPage = Number(url.searchParams.get("per_page") ?? 10);
  const page = Number(url.searchParams.get("page") ?? 1);
  const filtered = slug ? posts.filter((p) => p.slug === slug) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  if (page > totalPages) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ code: "rest_post_invalid_page_number" }));
  }

  res.writeHead(200, {
    "Content-Type": "application/json; charset=UTF-8",
    "X-WP-Total": String(filtered.length),
    "X-WP-TotalPages": String(totalPages),
  });
  res.end(JSON.stringify(filtered.slice((page - 1) * perPage, page * perPage)));
}).listen(PORT, () =>
  console.log(`mock WP REST API: http://localhost:${PORT}/wp-json/wp/v2/posts`),
);
