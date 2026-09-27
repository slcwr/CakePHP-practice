import sanitizeHtml from "sanitize-html";

/**
 * WordPress の本文 HTML を許可リスト方式でサニタイズする。
 * <script>・イベントハンドラ（onerror 等）・javascript: URL・iframe・style 属性は落とす。
 */
const options: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "del", "ins", "s", "mark"],
  allowedAttributes: {
    // WordPress のブロック用クラス（wp-block-* / aligncenter 等）は残す
    "*": ["class"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
    // 目次などのページ内リンク用
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    // 別タブで開くリンクから window.opener を辿られないようにする
    a: (tagName, attribs) =>
      attribs.target === "_blank"
        ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
        : { tagName, attribs },
  },
};

export const sanitizeContentHtml = (html: string) => sanitizeHtml(html, options);
