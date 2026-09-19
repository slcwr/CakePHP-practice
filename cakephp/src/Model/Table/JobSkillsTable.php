<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * @property \App\Model\Table\JobsTable&\Cake\ORM\Association\BelongsTo $Jobs
 * @extends \Cake\ORM\Table<array{}, \App\Model\Entity\JobSkill>
 * @method \App\Model\Entity\JobSkill[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\JobSkill>|false saveMany(iterable $entities, array $options = [])
 * @method \App\Model\Entity\JobSkill[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\JobSkill> saveManyOrFail(iterable $entities, array $options = [])
 * @method \App\Model\Entity\JobSkill[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\JobSkill>|false deleteMany(iterable $entities, array $options = [])
 * @method \App\Model\Entity\JobSkill[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\JobSkill> deleteManyOrFail(iterable $entities, array $options = [])
 */
class JobSkillsTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('job_skills');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->belongsTo('Jobs', [
            'foreignKey' => 'job_id',
            'joinType' => 'INNER',
        ]);
    }

    public function validationDefault(Validator $validator): Validator
    {
        return $validator
            ->notEmptyString('name')
            ->integer('sort');
    }
}
