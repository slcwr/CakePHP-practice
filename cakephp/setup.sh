#!/bin/sh
# 求人 API の初期化（cake-init コンテナから起動のたびに実行される）
# 1. 依存パッケージの取得  2. マイグレーション  3. 初期データ投入
set -eu
cd /workspace/cakephp

if [ ! -f vendor/autoload.php ]; then
  echo "[cake-init] composer install ..."
  composer install --no-interaction --no-progress
fi

if [ ! -f config/app_local.php ]; then
  echo "[cake-init] creating config/app_local.php ..."
  cp config/app_local.example.php config/app_local.php
fi

echo "[cake-init] waiting for MySQL ..."
until php -r '
try {
    new PDO(
        "mysql:host=" . getenv("DB_HOST") . ";dbname=" . getenv("DB_DATABASE"),
        getenv("DB_USERNAME"),
        getenv("DB_PASSWORD")
    );
    exit(0);
} catch (Throwable $e) {
    exit(1);
}
'; do
  sleep 2
done

echo "[cake-init] migrations migrate ..."
php bin/cake.php migrations migrate --no-lock

# シードは何度流しても同じ状態になる（DELETE してから INSERT する）ので --force で毎回実行
echo "[cake-init] seeds run JobsSeed ..."
php bin/cake.php seeds run JobsSeed --force --quiet

echo "[cake-init] done."
