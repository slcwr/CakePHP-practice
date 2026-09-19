<?php
declare(strict_types=1);

use function Cake\Core\env;

/*
 * ローカル設定。devcontainer では compose.yaml の environment から環境変数が渡ってくる。
 * DATABASE_URL を渡せば個別の設定より優先される（例: sqlite:///workspace/cakephp/tmp/dev.sqlite）。
 */
return [
    'debug' => filter_var(env('DEBUG', true), FILTER_VALIDATE_BOOLEAN),

    'Security' => [
        'salt' => env('SECURITY_SALT', 'ac58e3e7f6b04c4d9a1d5c0e0b6c8a2d7f3e9b1c4a6d8f0b2c4e6a8d0f2b4c6e'),
    ],

    'Datasources' => [
        'default' => [
            'driver' => 'Cake\Database\Driver\\' . env('DB_DRIVER', 'Mysql'),
            'host' => env('DB_HOST', 'db'),
            'port' => env('DB_PORT', null),
            'username' => env('DB_USERNAME', 'cakephp'),
            'password' => env('DB_PASSWORD', 'cakephp'),
            'database' => env('DB_DATABASE', 'jobs'),
            'url' => env('DATABASE_URL', null),
        ],

        'test' => [
            'url' => env('DATABASE_TEST_URL', 'sqlite://127.0.0.1/tmp/tests.sqlite'),
        ],
    ],

    'EmailTransport' => [
        'default' => [
            'host' => 'localhost',
            'port' => 25,
            'username' => null,
            'password' => null,
            'client' => null,
            'url' => env('EMAIL_TRANSPORT_DEFAULT_URL', null),
        ],
    ],
];
