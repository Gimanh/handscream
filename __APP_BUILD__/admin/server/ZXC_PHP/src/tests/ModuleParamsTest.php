<?php


use PHPUnit\Framework\TestCase;

class ModuleParamsTest extends TestCase
{
    public function testGetters()
    {
        $class = 'SomeClass';
        $options = ['params' => ['prop' => 'value']];
        $defer = true;
        $moduleParams = new \ZXC\Native\ModuleParams($class, $options, $defer);

        $this->assertSame($class, $moduleParams->getClass());
        $this->assertSame($options, $moduleParams->getOptions());
        $this->assertSame($defer, $moduleParams->isDefer());
    }
}
