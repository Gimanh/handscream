<?php

namespace App\Modules\Tags\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use App\Modules\Tasks\Tasks;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TagDelete extends TagBaseHandler
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
        $delete = $this->tags->deleteTag((int)$data['tagId']);
        return AppResponse::create($response, ['delete' => $delete], $request->getAttribute('rid'), 200);
    }
}
