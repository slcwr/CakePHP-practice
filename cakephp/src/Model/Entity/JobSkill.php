<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * @property int $id
 * @property int $job_id
 * @property string $name
 * @property int $sort
 * @property \App\Model\Entity\Job $job
 */
class JobSkill extends Entity
{
    protected array $_accessible = [
        '*' => true,
        'id' => false,
    ];
}
