export const formatSalary = (min: number, max: number) =>
  `${min.toLocaleString("ja-JP")}万円〜${max.toLocaleString("ja-JP")}万円`;

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeZone: "Asia/Tokyo" }).format(
    new Date(iso),
  );

/** WordPress の title.rendered などに含まれる HTML エンティティ・タグを落とす */
export const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
