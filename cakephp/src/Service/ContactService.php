<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\Entity\Contact;
use App\Model\Table\ContactsTable;
use App\Model\Table\JobsTable;
use Cake\Log\Log;
use Cake\ORM\Locator\LocatorAwareTrait;
use Throwable;

/**
 * 「お問い合わせを受け付ける」というユースケースをまとめる層。
 *
 * 複数のテーブルを見る・通知を送る・失敗時の扱いを決める、といった手順は
 * Table（データのルール）でもコントローラー（入出力）でもないのでここに置く。
 */
class ContactService
{
    use LocatorAwareTrait;

    private ContactsTable $Contacts;
    private JobsTable $Jobs;

    public function __construct()
    {
        $this->Contacts = $this->fetchTable('Contacts');
        $this->Jobs = $this->fetchTable('Jobs');
    }

    /**
     * お問い合わせを受け付ける。
     *
     * @param array<string, mixed> $data name / email / message / job_id
     * @return \App\Model\Entity\Contact 保存されたお問い合わせ
     * @throws \Cake\ORM\Exception\PersistenceFailedException 検証に失敗した場合
     */
    public function receive(array $data): Contact
    {
        $data['job_id'] = $this->resolveJobId($data['job_id'] ?? null);

        $contact = $this->Contacts->newEntity($data);
        $contact->status = ContactsTable::STATUS_NEW;

        $this->Contacts->saveOrFail($contact);

        // 通知が失敗しても、受け付けたこと自体は失わせない
        try {
            $this->notify($contact);
        } catch (Throwable $e) {
            Log::error('お問い合わせの通知に失敗しました: ' . $e->getMessage());
        }

        return $contact;
    }

    /**
     * 存在しない求人 ID は無視して、問い合わせ自体は受け付ける。
     * 掲載終了後に古いページから送られてくる場合があるため、エラーにはしない。
     */
    private function resolveJobId(mixed $jobId): ?int
    {
        if ($jobId === null || $jobId === '') {
            return null;
        }

        $id = (int)$jobId;

        return $this->Jobs->exists(['id' => $id]) ? $id : null;
    }

    /**
     * 担当者への通知。いまはログに記録するだけ（個人情報は出さない）。
     * 実案件ではここで Mailer を使う。
     */
    private function notify(Contact $contact): void
    {
        Log::info(sprintf(
            '新しいお問い合わせ id=%d job_id=%s',
            $contact->id,
            $contact->job_id === null ? '-' : (string)$contact->job_id,
        ));
    }
}
