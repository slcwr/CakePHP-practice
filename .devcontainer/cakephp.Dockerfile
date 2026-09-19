# 求人 API（CakePHP 5）用のイメージ。
# 公式 php イメージには intl / pdo_mysql と composer が入っていないので足す。
FROM php:8.3-cli-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libzip-dev unzip git \
    && docker-php-ext-install -j"$(nproc)" intl pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# composer のキャッシュ置き場（コンテナは node と同じ uid で動かすので /tmp に逃がす）
ENV COMPOSER_HOME=/tmp/composer \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /workspace/cakephp
