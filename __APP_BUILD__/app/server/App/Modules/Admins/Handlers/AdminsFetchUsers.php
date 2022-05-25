<?php

namespace App\Modules\Admins\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\Admins\BaseAdminsHandlers;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AdminsFetchUsers extends BaseAdminsHandlers
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $users = $this->admins->fetchUsers();

        return AppResponse::create($response, [
            'items' => $users,
            'headers' => $this->prepareHeaders($users[0]),
        ], $request->getAttribute('rid'));
    }

    private function prepareHeaders(array $userInfo = []): array
    {
        if (!$userInfo) {
            return [];
        }
        $allowed = [
            'id' => 'admin.id',
            'login' => 'admin.login',
            'email' => 'admin.email',
            'block' => 'admin.block'
        ];
        $result = [];
        $keys = array_keys($userInfo);
        foreach ($keys as $key) {
            $result[] = [
                'text' => $allowed[$key] ?? $key,
                'value' => $key
            ];
        }
        return $result;
    }
}
