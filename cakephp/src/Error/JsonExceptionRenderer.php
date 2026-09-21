<?php
declare(strict_types=1);

namespace App\Error;

use Cake\Core\Configure;
use Cake\Error\Renderer\WebExceptionRenderer;
use Psr\Http\Message\ResponseInterface;

/**
 * このアプリは JSON API 専用なので、例外も HTML ページではなく JSON で返す。
 *
 * これがないと 404 やサーバーエラーのときに HTML のエラーページが返り、
 * Next.js 側の res.json() が失敗して原因が分かりにくくなる。
 */
class JsonExceptionRenderer extends WebExceptionRenderer
{
    public function render(): ResponseInterface
    {
        $exception = $this->error;
        $code = $this->getHttpCode($exception);
        $this->clearOutput();

        $body = ['message' => $this->_message($exception, $code)];

        // 開発時だけ原因を追えるようにする（本番では message のみ）
        if (Configure::read('debug')) {
            $body += [
                'exception' => $exception::class,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ];
        }

        return $this->controller->getResponse()
            ->withStatus($code)
            ->withType('application/json')
            ->withStringBody(json_encode(
                $body,
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
            ));
    }
}
