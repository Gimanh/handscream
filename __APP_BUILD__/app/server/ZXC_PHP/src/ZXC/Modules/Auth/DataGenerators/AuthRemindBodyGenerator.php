<?php

namespace ZXC\Modules\Auth\DataGenerators;

class AuthRemindBodyGenerator implements AuthRemindPasswordEmailBodyGenerator
{
    protected AuthRemindPasswordUrlGenerator $urlGenerator;

    public function __construct(AuthRemindPasswordUrlGenerator $authRemindPasswordUrlGenerator)
    {
        $this->urlGenerator = $authRemindPasswordUrlGenerator;
    }

    public function generate(): string
    {
        return "<p> Reset password! {$this->urlGenerator->generate()} </p>";
    }
}
