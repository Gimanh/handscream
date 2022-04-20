<?php

namespace App\Modules\Tags\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use App\Modules\Tasks\Tasks;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TagToggle extends TagBaseHandler
{
    protected ?Tasks $tasks = null;

    public function __construct()
    {
        parent::__construct();
        $this->tasks = Modules::get('tasks');
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $data = $request->getParsedBody();
        $action = $this->tags->toggleTag((int)$data['tagId'], (int)$data['taskId']);
        return AppResponse::create($response, ['action' => $action], $request->getAttribute('rid'), 200);
    }
}
