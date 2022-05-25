<?php


use PHPUnit\Framework\TestCase;
use ZXC\Native\PSR\Uri;

class UriTest extends TestCase
{
    public $scheme = 'https';
    public $port = 3232;
    public $host = 'zxc.local';
    public $path = '/user/profile/9898';
    public $fragment = 'fragment';
    public $query = 'param=value';
    public $userName = 'user';
    public $userPass = 'pass';

    public function testParsedParams()
    {
        $uri = new Uri('https://user:pass@zxc.local:2020/user/profile/9898?param=value#fragment');
        $this->assertSame('https', $uri->getScheme());
        $this->assertSame('user:pass@zxc.local:2020', $uri->getAuthority());
        $this->assertSame('user:pass', $uri->getUserInfo());
        $this->assertSame('zxc.local', $uri->getHost());
        $this->assertSame(2020, $uri->getPort());
        $this->assertSame('/user/profile/9898', $uri->getPath());
        $this->assertSame('param=value', $uri->getQuery());
        $this->assertSame('fragment', $uri->getFragment());
        $this->assertSame('https://user:pass@zxc.local:2020/user/profile/9898?param=value#fragment', (string)$uri);
    }

    public function testSimpleUrl()
    {
        $expected = 'https://zxc.local:2020/user/profile/9898';
        $uri = new Uri($expected);
        $stringUri = (string)$uri;
        $this->assertSame($expected, $stringUri);
    }

    public function testUriMethhods()
    {
        $uri = new Uri();
        $uri = $uri
            ->withPort($this->port)
            ->withScheme($this->scheme)
            ->withUserInfo($this->userName, $this->userPass)
            ->withHost($this->host)
            ->withPath($this->path)
            ->withFragment($this->fragment)
            ->withQuery($this->query);

        $this->assertSame($this->port, $uri->getPort());
        $this->assertSame($this->scheme, $uri->getScheme());
        $this->assertSame($this->userName . ':' . $this->userPass, $uri->getUserInfo());
        $this->assertSame($this->host, $uri->getHost());
        $this->assertSame($this->path, $uri->getPath());
        $this->assertSame($this->fragment, $uri->getFragment());
        $this->assertSame($this->query, $uri->getQuery());

        $stringUri = (string)$uri;
        $expected = 'https://user:pass@zxc.local:3232/user/profile/9898?param=value#fragment';
        $this->assertSame($expected, $stringUri);
    }

    public function testFileSchemeWithEmptyHostReconstruction(): void
    {
        $uri = new Uri('file:///tmp/doc.pdf');

        self::assertSame('', $uri->getHost());
        self::assertSame('', $uri->getAuthority());
        self::assertSame('file:///tmp/doc.pdf', (string)$uri);
    }

    public function testHostToLowercase()
    {
        $uri = new Uri('//PhpLocal.CoM');

        self::assertSame('phplocal.com', $uri->getHost());
        self::assertSame('//phplocal.com', (string)$uri);

        $uri = (new Uri())->withHost('PhPlOCal.CoM');

        self::assertSame('phplocal.com', $uri->getHost());
        self::assertSame('//phplocal.com', (string)$uri);
    }

    public function testPortIfSchemeUnknown()
    {
        $uri = (new Uri('//phplocal.com'))->withPort(80);
        self::assertSame(80, $uri->getPort());
        self::assertSame('phplocal.com:80', $uri->getAuthority());
    }

    public function testRelativeUri(): void
    {
        $uri = (new Uri)->withPath('relative');
        self::assertSame('relative', $uri->getPath());
        self::assertSame('relative', (string)$uri);
    }

    public function testAuthorityWithUserInfoWithoutHost(): void
    {
        $uri = (new Uri())->withUserInfo('user', 'pass');

        self::assertSame('user:pass', $uri->getUserInfo());
        self::assertSame('user:pass@', $uri->getAuthority());
    }

    public function testAuthorityWithUserInfoOrPortButWithoutHost(): void
    {
        $uri = (new Uri())
            ->withUserInfo('user', 'pass')
            ->withPort(8080);
        self::assertSame(8080, $uri->getPort());
        self::assertSame('user:pass@:8080', $uri->getAuthority());
        self::assertSame('//user:pass@:8080', (string)$uri);

        $uri = $uri->withUserInfo('');
        self::assertSame(':8080', $uri->getAuthority());
    }
}
