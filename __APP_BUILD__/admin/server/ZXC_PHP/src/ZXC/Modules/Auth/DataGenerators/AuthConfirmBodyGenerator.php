<?php

namespace ZXC\Modules\Auth\DataGenerators;

class AuthConfirmBodyGenerator implements AuthConfirmEmailBodyGenerator
{
    protected AuthConfirmEmailUrlGenerator $urlGenerator;

    public function __construct(AuthConfirmEmailUrlGenerator $authConfirmEmailUrlGenerator)
    {
        $this->urlGenerator = $authConfirmEmailUrlGenerator;
    }

    public function generate(): string
    {
        return "<p> Confirm email! {$this->urlGenerator->generate()} </p>";
    }

}
