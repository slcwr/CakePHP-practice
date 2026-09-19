<?php
/**
 * Plugin Name: Next.js On-demand Revalidation
 * Description: 記事の公開・更新・削除時に Next.js の /api/revalidate を叩いてキャッシュを破棄する。
 */

if (!defined('ABSPATH')) {
    exit;
}

function geekly_practice_notify_next(string $slug = ''): void
{
    if (!defined('NEXT_REVALIDATE_URL') || !defined('NEXT_REVALIDATE_SECRET')) {
        return;
    }

    wp_remote_post(NEXT_REVALIDATE_URL, [
        'blocking' => false,
        'timeout'  => 3,
        'headers'  => [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . NEXT_REVALIDATE_SECRET,
        ],
        'body' => wp_json_encode(['type' => 'post', 'slug' => $slug]),
    ]);
}

// 公開・更新（publish→publish も発火する）・非公開化・ゴミ箱移動
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($post->post_type !== 'post') {
        return;
    }
    if ($new_status === 'publish' || $old_status === 'publish') {
        geekly_practice_notify_next($post->post_name);
    }
}, 10, 3);
