/** WP REST API (/wp/v2/posts) のレスポンスのうち使う項目だけ定義 */
export type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  _embedded?: {
    "wp:term"?: WPTerm[][];
  };
};

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

/** アプリ内で扱う形に整形したコラム */
export type Column = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  date: string;
  categories: { name: string; slug: string }[];
};
