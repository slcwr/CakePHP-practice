<?php
declare(strict_types=1);

use Migrations\BaseSeed;

/**
 * 練習用の求人データ（もとは src/data/jobs.ts にあったモックデータ）。
 * bin/cake migrations seed --seed JobsSeed
 */
class JobsSeed extends BaseSeed
{
    /**
     * @var list<array{id:int,title:string,company:string,category:string,location:string,remote:bool,salary_min:int,salary_max:int,description:string,published_at:string,skills:list<string>}>
     */
    private array $jobs = [
        [
            'id' => 1001,
            'title' => 'フロントエンドエンジニア（Next.js）',
            'company' => '株式会社サンプルテック',
            'category' => 'engineer',
            'location' => '東京都渋谷区',
            'remote' => true,
            'salary_min' => 550,
            'salary_max' => 850,
            'description' => '自社メディアのフロントエンド開発をお任せします。App Router への移行プロジェクトをリードいただきます。',
            'published_at' => '2026-09-14',
            'skills' => ['Next.js', 'TypeScript', 'CSS'],
        ],
        [
            'id' => 1002,
            'title' => 'バックエンドエンジニア（PHP/Laravel）',
            'company' => '株式会社ミライHR',
            'category' => 'engineer',
            'location' => '東京都港区',
            'remote' => false,
            'salary_min' => 500,
            'salary_max' => 800,
            'description' => '求人プラットフォームの API 開発。CakePHP からのリプレイスを進めています。',
            'published_at' => '2026-09-13',
            'skills' => ['PHP', 'Laravel', 'MySQL'],
        ],
        [
            'id' => 1003,
            'title' => 'UI/UXデザイナー',
            'company' => '株式会社デザインラボ',
            'category' => 'creator',
            'location' => '大阪府大阪市',
            'remote' => true,
            'salary_min' => 450,
            'salary_max' => 700,
            'description' => 'SaaS プロダクトの UI 設計とデザインシステムの整備を担当。',
            'published_at' => '2026-09-12',
            'skills' => ['Figma', 'デザインシステム'],
        ],
        [
            'id' => 1004,
            'title' => 'ゲームプランナー（スマホRPG）',
            'company' => '株式会社プレイワークス',
            'category' => 'game',
            'location' => '東京都新宿区',
            'remote' => false,
            'salary_min' => 400,
            'salary_max' => 650,
            'description' => '運営中タイトルのイベント企画・レベルデザイン。',
            'published_at' => '2026-09-11',
            'skills' => ['企画', 'Unity'],
        ],
        [
            'id' => 1005,
            'title' => 'Webマーケター（SEO/広告）',
            'company' => '株式会社グロースパートナーズ',
            'category' => 'marketing',
            'location' => '東京都千代田区',
            'remote' => true,
            'salary_min' => 450,
            'salary_max' => 750,
            'description' => 'オウンドメディアの集客戦略立案と改善施策の実行。',
            'published_at' => '2026-09-10',
            'skills' => ['SEO', 'Google Analytics', 'WordPress'],
        ],
        [
            'id' => 1006,
            'title' => 'テックリード（React/TypeScript）',
            'company' => '株式会社クラウドフォース',
            'category' => 'engineer',
            'location' => '福岡県福岡市',
            'remote' => true,
            'salary_min' => 750,
            'salary_max' => 1100,
            'description' => 'フロントエンドチーム（6名）の技術リード。テスト戦略の策定も担当。',
            'published_at' => '2026-09-09',
            'skills' => ['React', 'TypeScript', 'Storybook', 'GraphQL'],
        ],
        [
            'id' => 1007,
            'title' => '3DCGデザイナー',
            'company' => '株式会社プレイワークス',
            'category' => 'game',
            'location' => '東京都新宿区',
            'remote' => false,
            'salary_min' => 420,
            'salary_max' => 680,
            'description' => '家庭用ゲームのキャラクターモデリング。',
            'published_at' => '2026-09-08',
            'skills' => ['Maya', 'Blender'],
        ],
        [
            'id' => 1008,
            'title' => 'SRE / インフラエンジニア',
            'company' => '株式会社サンプルテック',
            'category' => 'engineer',
            'location' => '東京都渋谷区',
            'remote' => true,
            'salary_min' => 650,
            'salary_max' => 950,
            'description' => '大規模トラフィックを支えるインフラの設計・運用。',
            'published_at' => '2026-09-07',
            'skills' => ['AWS', 'Terraform', 'Kubernetes'],
        ],
        [
            'id' => 1009,
            'title' => 'Webデザイナー（コーディング有）',
            'company' => '株式会社デザインラボ',
            'category' => 'creator',
            'location' => 'リモート',
            'remote' => true,
            'salary_min' => 380,
            'salary_max' => 550,
            'description' => 'LP・コーポレートサイトのデザインとコーディング。',
            'published_at' => '2026-09-06',
            'skills' => ['HTML', 'CSS', 'WordPress'],
        ],
        [
            'id' => 1010,
            'title' => 'CRMマーケター',
            'company' => '株式会社ミライHR',
            'category' => 'marketing',
            'location' => '東京都港区',
            'remote' => false,
            'salary_min' => 480,
            'salary_max' => 720,
            'description' => '会員向けメール・プッシュ施策の設計と効果検証。',
            'published_at' => '2026-09-05',
            'skills' => ['MA', 'SQL'],
        ],
        [
            'id' => 1011,
            'title' => 'フルスタックエンジニア（Next.js/Laravel）',
            'company' => '株式会社グロースパートナーズ',
            'category' => 'engineer',
            'location' => '東京都千代田区',
            'remote' => true,
            'salary_min' => 600,
            'salary_max' => 900,
            'description' => '新規 SaaS をフロントからバックエンドまで一気通貫で開発。',
            'published_at' => '2026-09-04',
            'skills' => ['Next.js', 'Laravel', 'TypeScript'],
        ],
        [
            'id' => 1012,
            'title' => 'QAエンジニア（E2Eテスト）',
            'company' => '株式会社クラウドフォース',
            'category' => 'engineer',
            'location' => '福岡県福岡市',
            'remote' => true,
            'salary_min' => 450,
            'salary_max' => 700,
            'description' => 'テスト自動化基盤の構築と品質改善。',
            'published_at' => '2026-09-03',
            'skills' => ['Playwright', 'Vitest'],
        ],
    ];

    public function run(): void
    {
        // 何度流しても同じ状態になるように、先に消してから入れ直す
        $this->execute('DELETE FROM job_skills');
        $this->execute('DELETE FROM jobs');

        $now = date('Y-m-d H:i:s');
        $jobRows = [];
        $skillRows = [];

        foreach ($this->jobs as $job) {
            $skills = $job['skills'];
            unset($job['skills']);
            $job['remote'] = $job['remote'] ? 1 : 0;
            $jobRows[] = $job + ['created' => $now, 'modified' => $now];

            foreach ($skills as $sort => $name) {
                $skillRows[] = ['job_id' => $job['id'], 'name' => $name, 'sort' => $sort];
            }
        }

        $this->table('jobs')->insert($jobRows)->saveData();
        $this->table('job_skills')->insert($skillRows)->saveData();
    }
}
