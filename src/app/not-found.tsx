import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <h1 className="pageTitle">ページが見つかりません</h1>
      <Link href="/" className="textLink">
        トップへ戻る
      </Link>
    </div>
  );
}
