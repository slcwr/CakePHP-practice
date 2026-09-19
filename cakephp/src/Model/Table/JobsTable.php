<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\Database\Expression\IdentifierExpression;
use Cake\Database\Expression\QueryExpression;
use Cake\ORM\Query\SelectQuery;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * 求人テーブル。検索条件の組み立てはここに寄せる（コントローラは薄く保つ）。
 *
 * @property \App\Model\Table\JobSkillsTable&\Cake\ORM\Association\HasMany $JobSkills
 * @method \App\Model\Entity\Job newEmptyEntity()
 * @method \App\Model\Entity\Job get(mixed $primaryKey, array|string $finder = 'all', ...$args)
 * @extends \Cake\ORM\Table<array{Timestamp: \Cake\ORM\Behavior\TimestampBehavior}, \App\Model\Entity\Job>
 * @method \App\Model\Entity\Job[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\Job>|false saveMany(iterable $entities, array $options = [])
 * @method \App\Model\Entity\Job[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\Job> saveManyOrFail(iterable $entities, array $options = [])
 * @method \App\Model\Entity\Job[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\Job>|false deleteMany(iterable $entities, array $options = [])
 * @method \App\Model\Entity\Job[]|\Cake\Datasource\ResultSetInterface<int, \App\Model\Entity\Job> deleteManyOrFail(iterable $entities, array $options = [])
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class JobsTable extends Table
{
    /** 1ページあたりの件数（Next.js 側の PER_PAGE と合わせる） */
    public const PER_PAGE = 5;

    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('jobs');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');

        $this->hasMany('JobSkills', [
            'foreignKey' => 'job_id',
            'dependent' => true,
            'sort' => ['JobSkills.sort' => 'ASC'],
        ]);
    }

    public function validationDefault(Validator $validator): Validator
    {
        return $validator
            ->notEmptyString('title')
            ->notEmptyString('company')
            ->inList('category', ['engineer', 'creator', 'game', 'marketing'])
            ->notEmptyString('location')
            ->boolean('remote')
            ->integer('salary_min')
            ->integer('salary_max')
            ->notEmptyString('description')
            ->date('published_at');
    }

    /**
     * スキルを含めて新着順に並べた基本クエリ。
     */
    public function findApi(SelectQuery $query): SelectQuery
    {
        return $query
            ->contain(['JobSkills'])
            ->orderBy(['Jobs.published_at' => 'DESC', 'Jobs.id' => 'ASC']);
    }

    /**
     * 検索条件で絞り込む。
     *
     * @param array{keyword?:string|null, category?:string|null, remote?:bool} $params
     */
    public function findSearch(SelectQuery $query, array $params = []): SelectQuery
    {
        $query = $this->findApi($query);

        if (!empty($params['category'])) {
            $query->where(['Jobs.category' => $params['category']]);
        }

        if (!empty($params['remote'])) {
            $query->where(['Jobs.remote' => true]);
        }

        $keyword = trim((string)($params['keyword'] ?? ''));
        if ($keyword !== '') {
            // LIKE のワイルドカードはエスケープしてから部分一致にする
            $like = '%' . addcslashes($keyword, '%_\\') . '%';

            $query->where(function (QueryExpression $exp, SelectQuery $q) use ($like): QueryExpression {
                $hasSkill = $this->JobSkills->find()
                    ->select(['JobSkills.id'])
                    ->where([
                        'JobSkills.job_id' => new IdentifierExpression('Jobs.id'),
                        'JobSkills.name LIKE' => $like,
                    ]);

                // $exp->like() は $exp 自身を書き換えて返すので、ここでは条件配列で渡す
                return $exp->or([
                    'Jobs.title LIKE' => $like,
                    'Jobs.company LIKE' => $like,
                    'Jobs.description LIKE' => $like,
                    $q->expr()->exists($hasSkill),
                ]);
            });
        }

        return $query;
    }
}
