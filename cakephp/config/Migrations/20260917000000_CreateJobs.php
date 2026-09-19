<?php
declare(strict_types=1);

use Migrations\BaseMigration;

/**
 * 求人テーブル。
 * skills は job_skills に正規化してある（JSON カラムにすると DB ごとの検索方法の差が大きいため）。
 */
class CreateJobs extends BaseMigration
{
    public function up(): void
    {
        $this->table('jobs')
            ->addColumn('title', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('company', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('category', 'string', ['limit' => 32, 'null' => false])
            ->addColumn('location', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('remote', 'boolean', ['null' => false, 'default' => false])
            ->addColumn('salary_min', 'integer', ['null' => false, 'comment' => '年収（万円）'])
            ->addColumn('salary_max', 'integer', ['null' => false, 'comment' => '年収（万円）'])
            ->addColumn('description', 'text', ['null' => false])
            ->addColumn('published_at', 'date', ['null' => false])
            ->addColumn('created', 'datetime', ['null' => true])
            ->addColumn('modified', 'datetime', ['null' => true])
            ->addIndex(['category'])
            ->addIndex(['published_at'])
            ->create();

        $this->table('job_skills')
            ->addColumn('job_id', 'integer', ['null' => false])
            ->addColumn('name', 'string', ['limit' => 64, 'null' => false])
            ->addColumn('sort', 'integer', ['null' => false, 'default' => 0])
            ->addIndex(['job_id'])
            ->addIndex(['name'])
            ->addForeignKey('job_id', 'jobs', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->create();
    }

    public function down(): void
    {
        $this->table('job_skills')->drop()->save();
        $this->table('jobs')->drop()->save();
    }
}
