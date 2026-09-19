-- CakePHP（求人 API）用のデータベースとユーザー。
-- MySQL の公式イメージは、データ用ボリュームが空のときだけ docker-entrypoint-initdb.d を実行する。
-- 既に db_data ボリュームがある場合は反映されないので、その時は
--   docker compose -p geekly-practice down -v
-- でボリュームごと作り直すこと（WordPress の記事も消える）。
CREATE DATABASE IF NOT EXISTS jobs
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'cakephp'@'%' IDENTIFIED BY 'cakephp';
GRANT ALL PRIVILEGES ON jobs.* TO 'cakephp'@'%';
FLUSH PRIVILEGES;
