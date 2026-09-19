"use client";

// error.tsx は Client Component 必須。WordPress が落ちているときなどに表示される
export default function ColumnsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container" role="alert">
      <h1 className="pageTitle">コラムを読み込めませんでした</h1>
      <p className="muted">WordPress コンテナが起動しているか確認してください。</p>
      {process.env.NODE_ENV === "development" && (
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
      )}
      <button type="button" onClick={reset} style={{ marginTop: 16, padding: "8px 16px" }}>
        再試行
      </button>
    </div>
  );
}
