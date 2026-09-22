<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * お問い合わせテーブル。検証ルールはここに集約する（Service やコントローラーには書かない）。
 *
 * @method \App\Model\Entity\Contact newEmptyEntity()
 * @method \App\Model\Entity\Contact newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Contact get(mixed $primaryKey, array|string $finder = 'all', ...$args)
 * @method \App\Model\Entity\Contact saveOrFail(\Cake\Datasource\EntityInterface $entity, array $options = [])
 * @extends \Cake\ORM\Table<array{Timestamp: \Cake\ORM\Behavior\TimestampBehavior}, \App\Model\Entity\Contact>
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class ContactsTable extends Table
{
    /** 未対応 */
    public const STATUS_NEW = 'new';

    /** 対応済み */
    public const STATUS_HANDLED = 'handled';

    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('contacts');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Jobs', [
            'foreignKey' => 'job_id',
            'joinType' => 'LEFT',
        ]);
    }

    /**
     * 入力値の検証。Next.js 側の zod と同じ条件にしてある。
     */
    public function validationDefault(Validator $validator): Validator
    {
        return $validator
            ->notEmptyString('name', 'お名前を入力してください')
            ->maxLength('name', 50, '50文字以内で入力してください')
            ->email('email', false, 'メールアドレスの形式が正しくありません')
            ->notEmptyString('email', 'メールアドレスを入力してください')
            ->maxLength('message', 1000, '1000文字以内で入力してください')
            ->allowEmptyString('message')
            ->allowEmptyString('job_id')
            ->integer('job_id')
            ->inList('status', [self::STATUS_NEW, self::STATUS_HANDLED]);
    }

    /**
     * 存在しない求人 ID では保存させない（Service 側で null に落としてから来る想定の保険）。
     */
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->existsIn(['job_id'], 'Jobs', '指定された求人が見つかりません'), [
            'errorField' => 'job_id',
            'allowNullableNulls' => true,
        ]);

        return $rules;
    }

    /**
     * 管理用：未対応のものを新しい順に。
     */
    public function findUnhandled(\Cake\ORM\Query\SelectQuery $query): \Cake\ORM\Query\SelectQuery
    {
        return $query
            ->where(['Contacts.status' => self::STATUS_NEW])
            ->orderBy(['Contacts.created' => 'DESC']);
    }
}
