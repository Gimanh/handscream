<?php

namespace App\Modules\Goals\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use App\Modules\Goals\Goals;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Exceptions\AuthModuleNotFound;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class GoalsFetch
{
    /**
     * @var null | Goals
     */
    protected $goals = null;

    /**
     * @throws AuthModuleNotFound
     */
    public function __construct()
    {
        $this->goals = Modules::get('goals');
        if (!$this->goals) {
            throw new AuthModuleNotFound();
        }
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        /** @var $user User */
        $user = $request->getAttribute('user');
        return AppResponse::create($response, $this->goals->fetchGoals($user->getId()), $request->getAttribute('rid'), 200);
    }
}
