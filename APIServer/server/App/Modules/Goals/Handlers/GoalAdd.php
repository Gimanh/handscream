<?php

namespace App\Modules\Goals\Handlers;

use App\AppResponse;
use App\Modules\Goals\Goals;
use ZXC\Modules\Auth\User;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Exceptions\AuthModuleNotFound;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class GoalAdd
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
        $parsedBody = $request->getParsedBody();
        $name = $parsedBody['name'] ?? '';
        $description = $parsedBody['description'] ?? null;
        /** @var $user User */
        $user = $request->getAttribute('user');
        $goal = false;
        if ($name) {
            $goal = $this->goals->addGoal($name, $description, $user->getId());
        }
        return AppResponse::create($response, ['add' => !!$goal, 'goal' => $goal], $request->getAttribute('rid'), 200);
    }
}
