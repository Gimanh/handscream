<?php

namespace ZXC\Modules\Auth;

use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\LoginData;
use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\Auth\Data\ConfirmEmailData;
use ZXC\Modules\Auth\Data\ChangePasswordData;
use ZXC\Modules\Auth\Data\RemindPasswordData;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Modules\Auth\Data\ChangeRemindedPasswordData;

interface Authenticable
{
    public function login(LoginData $data): array;

    public function logout(ServerRequest $request): bool;

    public function register(RegisterData $data): array;

    public function confirmEmail(ConfirmEmailData $data): bool;

    public function remindPassword(RemindPasswordData $data): bool;

    public function changeRemindedPassword(ChangeRemindedPasswordData $data): bool;

    public function changePassword(ChangePasswordData $data);

    public function getUser(): ?UserModel;

    public function retrieveFromRequest(RequestInterface $request): ?UserModel;

}
