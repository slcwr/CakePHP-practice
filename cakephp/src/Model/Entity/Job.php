<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\I18n\Date;
use Cake\ORM\Entity;

/**
 * @property int $id
 * @property string $title
 * @property string $company
 * @property string $category
 * @property string $location
 * @property bool $remote
 * @property int $salary_min
 * @property int $salary_max
 * @property string $description
 * @property \Cake\I18n\Date $published_at
 * @property \App\Model\Entity\JobSkill[] $job_skills
 * @property \Cake\I18n\DateTime|null $created
 * @property \Cake\I18n\DateTime|null $modified
 */
class Job extends Entity
{
    protected array $_accessible = [
        '*' => true,
        'id' => false,
    ];

    /**
     * API で返す形（snake_case）。日付は 'Y-m-d' に固定する。
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        $publishedAt = $this->published_at;

        return [
            'id' => (string)$this->id,
            'title' => $this->title,
            'company' => $this->company,
            'category' => $this->category,
            'location' => $this->location,
            'remote' => (bool)$this->remote,
            'salary_min' => (int)$this->salary_min,
            'salary_max' => (int)$this->salary_max,
            'skills' => array_map(
                static fn (JobSkill $skill): string => $skill->name,
                $this->job_skills ?? [],
            ),
            'description' => $this->description,
            'published_at' => $publishedAt instanceof Date
                ? $publishedAt->format('Y-m-d')
                : (string)$publishedAt,
        ];
    }
}
