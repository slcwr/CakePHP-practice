#!/bin/sh
# WordPress の初期セットアップ（wpcli コンテナから1回だけ実行される）
set -eu
cd /var/www/html

echo "[wpcli] waiting for wp-config.php ..."
until [ -f wp-config.php ]; do sleep 2; done

if wp core is-installed 2>/dev/null; then
  echo "[wpcli] WordPress is already installed. skip."
  exit 0
fi

wp core install \
  --url=http://localhost:8080 \
  --title="IT転職ナビ CMS（練習用）" \
  --admin_user=admin --admin_password=admin \
  --admin_email=admin@example.com --skip-email

# /wp-json/ で REST API を叩けるようにパーマリンクを設定
wp rewrite structure '/%postname%/'
wp option update timezone_string 'Asia/Tokyo'
wp post delete 1 --force  # Hello world! を削除

wp term create category "転職ノウハウ" --slug=knowhow
wp term create category "職種解説" --slug=job-type
wp term create category "年収・キャリア" --slug=career

create_post() {
  # $1=slug $2=title $3=category $4=date $5=content
  wp post create --post_type=post --post_status=publish \
    --post_name="$1" --post_title="$2" --post_category="$3" \
    --post_date="$4" --post_content="$5" --porcelain
}

create_post "portfolio-tips" "エンジニア転職で評価されるポートフォリオの作り方" knowhow "2026-09-01 10:00:00" \
'<p>ポートフォリオは「何を作ったか」よりも「なぜそう作ったか」が見られます。</p>
<h2>READMEに書くべきこと</h2>
<ul><li>解決したい課題</li><li>技術選定の理由</li><li>工夫した点・苦労した点</li></ul>
<h2>デプロイして触れる状態にする</h2>
<p>面接官がURLを開いてすぐ動かせることが大切です。</p>'

create_post "frontend-engineer" "フロントエンドエンジニアの仕事内容と必要スキル" job-type "2026-09-03 10:00:00" \
'<p>フロントエンドエンジニアは、ユーザーが直接触れるUIを実装する職種です。</p>
<h2>主な技術スタック</h2>
<ul><li>HTML / CSS / JavaScript</li><li>TypeScript</li><li>React / Next.js</li></ul>
<h2>最近のトレンド</h2>
<p>React Server Components により、サーバーとクライアントの境界設計が重要になっています。</p>'

create_post "salary-negotiation" "年収交渉で失敗しないための3つのポイント" career "2026-09-05 10:00:00" \
'<p>年収交渉はタイミングと根拠が重要です。</p>
<h2>1. 市場価値を把握する</h2><p>同じスキルセットの求人の年収レンジを調べましょう。</p>
<h2>2. 実績を数字で伝える</h2><p>「表示速度を40%改善」など定量的に。</p>
<h2>3. エージェントを活用する</h2><p>直接言いにくい条件面の調整を任せられます。</p>'

create_post "interview-questions" "面接でよく聞かれる質問と回答例" knowhow "2026-09-08 10:00:00" \
'<p>技術面接では経験の深さが問われます。</p>
<h2>よくある質問</h2>
<ul><li>これまでで一番難しかった技術課題は？</li><li>チーム開発で意識していることは？</li><li>最近キャッチアップした技術は？</li></ul>'

create_post "web-director" "Webディレクターとは？エンジニアとの違い" job-type "2026-09-10 10:00:00" \
'<p>Webディレクターは、サイト制作・運用の進行管理と品質管理を担います。</p>
<h2>エンジニアとの連携</h2><p>要件を分解し、実装可能な単位でチケット化するのが腕の見せ所です。</p>'

create_post "remote-work" "フルリモート求人を探すときの注意点" career "2026-09-12 10:00:00" \
'<p>フルリモートでは、テキストコミュニケーション力が成果を左右します。</p>
<h2>確認したいポイント</h2>
<ul><li>稼働時間の拘束（コアタイム）</li><li>使用ツール（Slack、GitHubなど）</li><li>オンボーディング体制</li></ul>'

echo "[wpcli] setup completed 🎉  admin: http://localhost:8080/wp-admin (admin / admin)"
