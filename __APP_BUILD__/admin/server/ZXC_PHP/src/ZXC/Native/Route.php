<?php


namespace ZXC\Native;


use InvalidArgumentException;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;


class Route implements RequestHandlerInterface
{
    /**
     * @var string
     */
    private $regex;

    /**
     * @var string
     */
    private $routePath;

    /**
     * @var string
     */
    private $requestMethod;

    private $routeURIParams = [];

    private $children;

    private $middlewares = [];

    /** @var Router */
    protected $router = null;

    /** @var string */
    private $handlerString = '';

    /** @var ServerRequestInterface */
    protected $serverRequest = null;

    public function __construct(Router $router, array $routeParams)
    {
        $this->router = $router;
        $this->serverRequest = $this->router->getServerRequest();
        $this->parseRouteParams($routeParams);
    }

    public function parseRouteParams(array $routeParams = []): void
    {
        $parsedParams = $this->cleanRoutePath($routeParams);
        if (isset($routeParams['middlewares'])) {
            if (is_array($routeParams['middlewares'])) {
                foreach ($routeParams['middlewares'] as $name) {
                    $this->middlewares[] = $this->router->getMiddlewareHandler($name) ?? $name;
                }
            }
        }

        $this->middlewares = array_merge($this->router->getAppMiddlewareHandlers(), $this->middlewares);

        $this->regex = $this->createRegex($parsedParams['route']);
        $this->requestMethod = $parsedParams['method'];
        $this->routePath = $parsedParams['route'];
        $this->handlerString = $parsedParams['handler'];
        if (isset($routeParams['children'])) {
            $this->children = $this->prepareChildren($routeParams['children']);
        }
    }

    /**
     * @param $childrenParams
     * @return array
     */
    public function prepareChildren($childrenParams)
    {
        if (!isset($childrenParams['route'])) {
            throw new InvalidArgumentException('Invalid $childrenParams');
        }

        if (!isset($childrenParams['method'])) {
            $childrenParams['method'] = $this->requestMethod;
        }

        $parsedRoute = $this->cleanRoutePath($childrenParams);

        if ($this->routePath !== '/') {
            $parsedRoute['route'] = $this->routePath . '/' . $parsedRoute['route'];
        } else {
            $parsedRoute['route'] = $this->routePath . $parsedRoute['route'];
        }

        return $parsedRoute;
    }

    public function cleanRoutePath(array $routeParams): array
    {
        $routeParams['route'] = preg_replace('!\s+!', '', $routeParams['route']);
        return $routeParams;
    }

    /**
     * @param $pattern
     *
     * @return bool|string
     * @link Thanks https://stackoverflow.com/questions/30130913/how-to-do-url-matching-regex-for-routing-framework/30359808#30359808
     */
    public function createRegex(string $pattern): string
    {
        if (preg_match('/[^-:\/_{}()a-zA-Z\d]/', $pattern)) {
            throw new InvalidArgumentException('Invalid pattern');
        } // Invalid pattern

        // Turn "(/)" into "/?"
        $pattern = preg_replace('#\(/\)#', '/?', $pattern);

        // Create capture group for ":parameter"
        $allowedParamChars = '[a-zA-Z0-9\_\-\@\.]+';
        $pattern = preg_replace(
            '/:(' . $allowedParamChars . ')/',   # Replace ":parameter"
            '(?<$1>' . $allowedParamChars . ')',
            # with "(?<parameter>[a-zA-Z0-9\_\-]+)"
            $pattern
        );

        // Create capture group for '{parameter}'
        $pattern = preg_replace(
            '/{(' . $allowedParamChars . ')}/',    # Replace "{parameter}"
            '(?<$1>' . $allowedParamChars . ')',
            # with "(?<parameter>[a-zA-Z0-9\_\-]+)"
            $pattern
        );

        // Add start and end matching
        $patternAsRegex = "@^" . $pattern . "$@D";

        return $patternAsRegex;
    }

    /**
     * @return string
     */
    public function getMethod(): string
    {
        return $this->requestMethod;
    }

    /**
     * @return string
     */
    public function getRoutePath(): string
    {
        return $this->routePath;
    }

    /**
     * @return string
     */
    public function getRegex(): string
    {
        return $this->regex;
    }

    /**
     * @param mixed $routeURIParams
     */
    public function setRouteURIParams($routeURIParams)
    {
        $this->routeURIParams = $routeURIParams;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->callCallback(
            $this->handlerString,
            $request,
            $this->router->getResponse(),
            new RouteParams($this->routeURIParams)
        );
    }

    public function executeRoute()
    {
        if ($this->middlewares) {
            $handlersStack = new Handler($this);
            $count = count($this->middlewares) - 1;
            for ($i = $count; $i >= 0; $i--) {
                $handlersStack = new Handler($this->wrapMiddleware($this->middlewares[$i]), $handlersStack, $this->middlewares[$i]);
            }
            return $handlersStack->handle($this->serverRequest);
        } else {
            return $this->handle($this->router->getServerRequest());
        }
    }

    public function wrapMiddleware($name): callable
    {
        return function (ServerRequestInterface $request, RequestHandlerInterface $handler) use ($name) {
            return $this->callCallback($name, $request, $handler);
        };
    }

    public function callCallback($callback)
    {
        $args = func_get_args();
        unset($args[0]);
        return (new RouteHandler($callback, $args))->call();
    }

    public function getChildren()
    {
        return $this->children;
    }

    public function isThisYourPath(string $path)
    {
        if (preg_match($this->getRegex(), $path, $matches)) {
            return array_intersect_key(
                $matches,
                array_flip(
                    array_filter(
                        array_keys($matches),
                        'is_string'
                    )
                )
            );
        }
        return false;
    }
}
