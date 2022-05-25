<?php


use ZXC\Traits\Module;
use ZXC\Native\Modules;
use ZXC\Interfaces\IModule;
use \ZXC\Native\ModuleParams;
use PHPUnit\Framework\TestCase;

class ModulesTest extends TestCase
{
    public $optionsOne = [
        'prop' => 'value'
    ];

    public $optionsTwo = [
        'prop' => 1
    ];

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
    }

    public function setUp(): void
    {
        Modules::install([
            'one' => [
                'class' => 'ModuleOneTest',
                'options' => $this->optionsOne,
                'defer' => false
            ],
            'two' => [
                'class' => 'ModuleTwoTest',
                'options' => $this->optionsTwo,
                'defer' => true
            ],
        ]);
    }

    public function testGet()
    {
        /** @var ModuleOneTest $one */
        $one = Modules::get('one');
        $this->assertInstanceOf(ModuleOneTest::class, $one);
        $this->assertSame('one', $one->getName());
        $this->assertSame($this->optionsOne, $one->config);

        /** @var ModuleTwoTest $two */
        $two = Modules::get('two');
        $this->assertInstanceOf(ModuleTwoTest::class, $two);
        $this->assertSame('two', $two->getName());
        $this->assertSame($this->optionsTwo, $two->config);
    }

    public function testGetNewDeferredTrue()
    {
        $newProp = ['newProp' => 'someValue'];
        $two = Modules::getNew('two', $newProp);
        $this->assertSame($newProp, $two->config);

        /** @var ModuleTwoTest $defaultTwo */
        $defaultTwo = Modules::get('two');
        $this->assertSame($this->optionsTwo, $defaultTwo->config);
    }

    public function testGetNewDeferredFalse()
    {
        $newProp = ['newProp' => 'someValue'];
        $one = Modules::getNew('one', $newProp);
        $this->assertSame($newProp, $one->config);

        /** @var ModuleTwoTest $defaultOne */
        $defaultOne = Modules::get('one');
        $this->assertSame($this->optionsOne, $defaultOne->config);
    }

    public function testHas()
    {
        $this->assertTrue(Modules::has('one'));
        $this->assertFalse(Modules::has('noName'));
    }

    public function testCreateInstance()
    {
        $prop = ['newProp' => 'someValue'];
        /** @var ModuleOneTest $instance */
        $instance = Modules::createInstance(new ModuleParams(ModuleOneTest::class, $prop, false));
        $this->assertInstanceOf(ModuleOneTest::class, $instance);
        $this->assertInstanceOf(IModule::class, $instance);
        $this->assertSame($prop, $instance->config);
    }

    public function testGetByClassName()
    {
        $instance = Modules::getByClassName(ModuleOneTest::class);
        $this->assertInstanceOf(ModuleOneTest::class, $instance);

        $instance = Modules::getByClassName(ModuleTwoTest::class);
        $this->assertInstanceOf(ModuleTwoTest::class, $instance);
    }

    public function testGetByClassNameNull()
    {
        $instance = Modules::getByClassName('SomeClass');
        $this->assertNull($instance);
    }

    public function testUninstall()
    {
        /** @var ModuleOneTest $one */
        $one = Modules::get('one');
        $this->assertInstanceOf(ModuleOneTest::class, $one);

        /** @var ModuleTwoTest $two */
        $two = Modules::get('two');
        $this->assertInstanceOf(ModuleTwoTest::class, $two);

        $result = Modules::uninstall(['one' => true, 'two' => false]);
        $this->assertTrue($result);

        $oneMore = Modules::get('one');
        $this->assertNull($oneMore);

        /** @var ModuleTwoTest $two */
        $two = Modules::get('two');
        $this->assertInstanceOf(ModuleTwoTest::class, $two);
    }
}

class ModuleOneTest implements IModule
{
    use Module;

    public $config = [];

    private $name = 'one';

    public function init(array $options = [])
    {
        $this->config = $options;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}

class ModuleTwoTest implements IModule
{
    use Module;

    public $config = [];

    private $name = 'two';

    public function init(array $options = [])
    {
        $this->config = $options;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}
