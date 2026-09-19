<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Entity\Job;
use App\Model\Table\JobsTable;
use Cake\Http\Response;

/**
 * 求人 API。JSON だけを返す（画面は Next.js 側が持つ）。
 *
 * GET /jobs?keyword=&category=&remote=1&page=2  検索
 * GET /jobs?ids=1001,1002                        指定IDをまとめて取得
 * GET /jobs/ids                                  ID 一覧（SSG の generateStaticParams 用）
 * GET /jobs/1001                                 詳細
 *
 * @property \App\Model\Table\JobsTable $Jobs
 */
class JobsController extends AppController
{
    /** ids パラメータで一度に取得できる上限 */
    private const MAX_IDS = 50;

    public function index(): Response
    {
        $ids = $this->request->getQuery('ids');
        if ($ids !== null) {
            return $this->findByIds((string)$ids);
        }

        $params = [
            'keyword' => (string)$this->request->getQuery('keyword', ''),
            'category' => (string)$this->request->getQuery('category', ''),
            'remote' => filter_var($this->request->getQuery('remote'), FILTER_VALIDATE_BOOLEAN),
        ];

        $query = $this->Jobs->find('search', params: $params);

        $total = $query->count();
        $totalPages = max(1, (int)ceil($total / JobsTable::PER_PAGE));
        // 範囲外のページ番号は最終ページに丸める
        $page = min(max(1, (int)$this->request->getQuery('page', 1)), $totalPages);

        $items = $query
            ->offset(($page - 1) * JobsTable::PER_PAGE)
            ->limit(JobsTable::PER_PAGE)
            ->all();

        return $this->json([
            'items' => array_map(static fn (Job $job): array => $job->toApiArray(), $items->toList()),
            'total' => $total,
            'page' => $page,
            'total_pages' => $totalPages,
        ]);
    }

    public function view(string $id): Response
    {
        $job = $this->Jobs->find('api')->where(['Jobs.id' => (int)$id])->first();

        if ($job === null) {
            return $this->json(['message' => 'Job not found'], 404);
        }

        return $this->json($job->toApiArray());
    }

    public function ids(): Response
    {
        $ids = $this->Jobs->find()
            ->select(['Jobs.id'])
            ->orderBy(['Jobs.published_at' => 'DESC', 'Jobs.id' => 'ASC'])
            ->all()
            ->map(static fn (Job $job): string => (string)$job->id)
            ->toList();

        return $this->json(['ids' => $ids]);
    }

    /**
     * お気に入り一覧（CSR）用。リクエストされた ID の順番を保って返す。
     */
    private function findByIds(string $raw): Response
    {
        $ids = array_slice(array_filter(array_map('trim', explode(',', $raw)), 'strlen'), 0, self::MAX_IDS);

        if ($ids === []) {
            return $this->json(['items' => [], 'total' => 0]);
        }

        $jobs = $this->Jobs->find('api')
            ->where(['Jobs.id IN' => array_map('intval', $ids)])
            ->all()
            ->indexBy('id')
            ->toArray();

        $items = [];
        foreach ($ids as $id) {
            $job = $jobs[(int)$id] ?? null;
            if ($job !== null) {
                $items[] = $job->toApiArray();
            }
        }

        return $this->json(['items' => $items, 'total' => count($items)]);
    }

    /**
     * @param array<string, mixed> $data
     */
    private function json(array $data, int $status = 200): Response
    {
        return $this->response
            ->withStatus($status)
            ->withType('application/json')
            ->withStringBody((string)json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
}
