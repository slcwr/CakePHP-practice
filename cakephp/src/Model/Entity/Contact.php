<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\I18n\DateTime;
use Cake\ORM\Entity;

/**
 * @property int $id
 * @property int|null $job_id
 * @property string $name
 * @property string $email
 * @property string $message
 * @property string $status
 * @property \Cake\I18n\DateTime|null $created
 * @property \Cake\I18n\DateTime|null $modified
 */
class Contact extends Entity
{
    protected array $_accessible = [
        'job_id' => true,
        'name' => true,
        'email' => true,
        'message' => true,
    ];

    /**
     * API で返す形。個人情報は返さず、受付が成功したことだけを伝える。
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        $created = $this->created;

        return [
            'id' => (string)$this->id,
            'status' => $this->status,
            'created' => $created instanceof DateTime ? $created->format('Y-m-d H:i:s') : null,
        ];
    }
}
