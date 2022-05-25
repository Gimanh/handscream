<?php


use PHPUnit\Framework\TestCase;
use ZXC\Native\Config;

class ConfigTest extends TestCase
{
    public $config = [
        'url' => 'https://gimanh.github.io/zxc_php_doc/',
        'bool' => true,
        'array' => [
            'prop' => 'value'
        ]
    ];

    public function setUp(): void
    {
        Config::init($this->config);
    }

    public function testGetMethodString()
    {
        $url = Config::get('url');
        $this->assertSame($this->config['url'], $url);
    }

    public function testGetMethodBool()
    {
        $bool = Config::get('bool');
        $this->assertSame($this->config['bool'], $bool);
    }

    public function testGetMethodArray()
    {
        $array = Config::get('array');
        $this->assertSame($this->config['array'], $array);
    }

    public function testGetMethodNested()
    {
        $nested = Config::get('array/prop');
        $this->assertSame($this->config['array']['prop'], $nested);
    }

    public function testAddMethodBoolValue()
    {
        Config::add(['booleanValue' => true]);
        $boolVal = Config::get('booleanValue');
        $this->assertTrue($boolVal);
    }

    public function testAddMethodStringValue()
    {
        Config::add(['stringValue' => 'string']);
        $stringVal = Config::get('stringValue');
        $this->assertSame('string', $stringVal);
    }

    public function testAddMethodArrayValue()
    {
        Config::add(['arrayValue' => ['propNew' => 'string']]);
        $stringVal = Config::get('arrayValue/propNew');
        $this->assertSame('string', $stringVal);
    }

    public function testAddMethodToExistingArrayValue()
    {
        Config::add(['array' => ['propNew' => 'string']]);
        $arrayVal = Config::get('array');
        $this->assertNotSame($this->config['array'], $arrayVal);

        $extendedConfig = ['prop' => 'value', 'propNew' => 'string'];
        $this->assertSame($extendedConfig, $arrayVal);
    }

    public function testAddMethodOverrideProp()
    {
        $newValue = ['prop' => 'newString', 'prop2' => ['key' => 'value']];
        Config::add(['array' => $newValue]);
        $arrayVal = Config::get('array');
        $this->assertNotSame($this->config['array'], $arrayVal);

        $expected = ['prop' => ['value', 'newString'], 'prop2' => ['key' => 'value']];
        $this->assertSame($expected, $arrayVal);
    }
}
