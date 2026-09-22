<?php
declare(strict_types=1);

use Migrations\BaseMigration;

/**
 * お問い合わせテーブル。
 * job_id は「この求人について」の問い合わせのときだけ入る（求人が消えても問い合わせは残す）。
 */
class CreateContacts extends BaseMigration
{
    public function up(): void
    {
        $this->table('contacts')
            ->addColumn('job_id', 'integer', ['null' => true])
            ->addColumn('name', 'string', ['limit' => 50, 'null' => false])
            ->addColumn('email', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('message', 'text', ['null' => false])
            ->addColumn('status', 'string', [
                'limit' => 16,
                'null' => false,
                'default' => 'new',
                'comment' => 'new: 未対応 / handled: 対応済み',
            ])
            ->addColumn('created', 'datetime', ['null' => true])
            ->addColumn('modified', 'datetime', ['null' => true])
            ->addIndex(['status'])
            ->addIndex(['created'])
            ->addForeignKey('job_id', 'jobs', 'id', ['delete' => 'SET_NULL', 'update' => 'CASCADE'])
            ->create();
    }

    public function down(): void
    {
        $this->table('contacts')->drop()->save();
    }
}
