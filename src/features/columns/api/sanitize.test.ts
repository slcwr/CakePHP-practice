import { describe, expect, it } from "vitest";
import { sanitizeContentHtml } from "@/features/columns/api/sanitize";

describe("sanitizeContentHtml", () => {
  it("script タグとイベントハンドラを取り除く", () => {
    const html = sanitizeContentHtml(
      '<p>本文</p><script>alert(1)</script><img src="https://example.com/a.png" onerror="alert(1)" alt="図">',
    );
    expect(html).toBe('<p>本文</p><img src="https://example.com/a.png" alt="図" />');
  });

  it("javascript: / data: の URL を落とす", () => {
    expect(sanitizeContentHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
    expect(sanitizeContentHtml('<img src="data:image/svg+xml,<svg onload=alert(1)>">')).toBe(
      "<img />",
    );
  });

  it("iframe と style 属性を取り除く", () => {
    expect(
      sanitizeContentHtml('<iframe src="https://evil.example"></iframe><p style="color:red">x</p>'),
    ).toBe("<p>x</p>");
  });

  it("WordPress の通常の本文（見出し・クラス・リスト・リンク）は残す", () => {
    const input =
      '<h2 id="intro" class="wp-block-heading">はじめに</h2><ul><li>a</li></ul><a href="https://example.com/">link</a>';
    expect(sanitizeContentHtml(input)).toBe(input);
  });

  it('target="_blank" のリンクには rel="noopener noreferrer" を付ける', () => {
    expect(sanitizeContentHtml('<a href="https://example.com/" target="_blank">x</a>')).toBe(
      '<a href="https://example.com/" target="_blank" rel="noopener noreferrer">x</a>',
    );
  });
});
