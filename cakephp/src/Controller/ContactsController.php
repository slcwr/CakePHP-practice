<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\ContactService;
use Cake\Http\Response;
use Cake\ORM\Exception\PersistenceFailedException;

/**
 * お問い合わせ API。Next.js の Server Action（submitContact）から呼ばれる。
 *
 * POST /contacts  { name, email, message, job_id? }
 */
class ContactsController extends AppController
{
    public function add(): Response
    {
        $data = $this->request->getData();

        try {
            $contact = (new ContactService())->receive([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'message' => $data['message'] ?? '',
                'job_id' => $data['job_id'] ?? null,
            ]);
        } catch (PersistenceFailedException $e) {
            // 項目ごとのエラーをそのまま返す（Next.js 側で各入力欄に表示する）
            return $this->json([
                'message' => '入力内容を確認してください',
                'errors' => $e->getEntity()->getErrors(),
            ], 422);
        }

        return $this->json($contact->toApiArray(), 201);
    }
}
