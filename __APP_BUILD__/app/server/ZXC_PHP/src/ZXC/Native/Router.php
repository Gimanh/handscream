<?php


namespace ZXC\Native;


use RuntimeException;
use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\UriInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseFactoryInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestFactoryInterface;


class Router
{

    const METHOD_OPTIONS = 'OPTIONS';

    /**
     * Routes from config
     * @var array
     */
    protected $routes = [];

    /**
     * Preflight request handler
     * @var null
     */
    protected $preflight = null;

    /**
     * Named middlewares
     * @var array
     */
    protected $middlewares = [];

    /**
     * @var null|callable|string
     */
    protected $notFoundHandler = null;

    /** @var ServerRequestInterface */
    protected $serverRequest = null;

    /** @var ResponseInterface */
    protected $response = null;

    /** @var array */
    protected $appMiddlewares = [];

    protected $corsEnabled = false;

    public function __construct(
        ServerRequestFactoryInterface $serverRequestFactory,
        ResponseFactoryInterface      $responseFactory,
        array                         $routeConfig
    )
    {
        $this->serverRequest = $serverRequestFactory->createServerRequest('', '');
        $this->serverRequest = $this->serverRequest->withAttribute('rid', uniqid());
        $this->response = $responseFactory->createResponse();
        $this->prepare($routeConfig);
    }

    public function prepare(array $config = []): bool
    {
        if (!isset($config['routes'])) {
            throw new InvalidArgumentException('Undefined routes in Router config');
        }

        $this->corsEnabled = $config['enableCors'] ?? false;

        $this->appMiddlewares = $config['useAppMiddlewares'] ?? [];

        $this->middlewares = $config['middlewares'] ?? [];

        $this->preflight = $config['preflight'] ?? null;

        $this->notFoundHandler = $config['notFoundHandler'] ?? 'ZXC\Native\NotFound:notFound';

        $this->checkAppMiddlewares();

        foreach ($config['routes'] as $routeParams) {
            $this->initRoute($routeParams);
        }

        return true;
    }

    public function checkAppMiddlewares(): void
    {
        foreach ($this->appMiddlewares as $key => $value) {
            if (!isset($this->middlewares[$key])) {
                throw new RuntimeException('App middleware "' . $key . '" must be registered in "middlewares"');
            }
        }
    }

    /**
     * @method callMiddleware
     * @param $name
     * @return string|null
     */
    public function getMiddlewareHandler($name)
    {
        if (isset($this->middlewares[$name])) {
            return $this->middlewares[$name];
        }
        return null;
    }

    public function initRoute($routeParams): bool
    {
        $routeInstance = new Route($this, $routeParams);
        $this->registerRouteInstance($routeInstance);
        $children = $routeInstance->getChildren();
        if ($children) {
            $this->initRoute($children);
        }

        return true;
    }

    private function registerRouteInstance(Route $parsedRoute): void
    {
        $this->routes[$parsedRoute->getMethod()][$parsedRoute->getRoutePath()] = $parsedRoute;
        if ($this->corsEnabled) {
            $this->routes[self::METHOD_OPTIONS][$parsedRoute->getRoutePath()] = $parsedRoute;
        }
    }

    /**
     * @return false|Route
     */
    public function getUriRoute()
    {
        $path = $this->getNormalizedPath(
            $this->serverRequest->getUri()
        );
        $method = $this->serverRequest->getMethod();
        if (!isset($this->routes[$method])) {
            throw new InvalidArgumentException(
                'Invalid request method "'
                . $method . '" set "'
                . $method . '"=>true in config file'
            );
        }
        /**@var $route Route */
        foreach ($this->routes[$method] as $route) {
            $isValidRouteParams = $route->isThisYourPath($path);
            if ($isValidRouteParams !== false) {
                $route->setRouteURIParams($isValidRouteParams ?? []);
                return $route;
            }
        }
        return false;
    }

    public function getNormalizedPath(UriInterface $uri): string
    {
        $path = $uri->getPath();
        $baseRoute = dirname($_SERVER['SCRIPT_NAME']);
        if ($path !== '/' && $baseRoute !== '/') {
            $lastSlash = substr($path, -1);
            if ($lastSlash === '/') {
                $path = rtrim($path, '/');
            }
            if ($path === $baseRoute) {
                $path = '/';
            } elseif ($path !== $baseRoute) {
                $position = strpos($path, $baseRoute);
                if ($position === 0) {
                    $path = str_replace($baseRoute, '', $path);
                }
            }
        }
        return $path;
    }

    public function go(): ResponseInterface
    {
        $routeParams = $this->getUriRoute();
        if (!$routeParams) {
            return $this->callNotFound();
        }
        $routeHandler = $routeParams->executeRoute();
        if ($routeHandler instanceof ResponseInterface) {
            return $routeHandler;
        } else {
            return $this->response->write((string)$routeHandler);
        }
    }

    private function callNotFound(): ResponseInterface
    {
        if ($this->notFoundHandler) {
            return (new RouteHandler($this->notFoundHandler, [$this->serverRequest]))->call();
        } else {
            return $this->response->withStatus(404);
        }
    }

    /**
     * @return ServerRequestInterface
     */
    public function getServerRequest(): ServerRequestInterface
    {
        return $this->serverRequest;
    }

    /**
     * @return ResponseInterface
     */
    public function getResponse(): ResponseInterface
    {
        return $this->response;
    }

    /**
     * @return array
     */
    public function getAppMiddlewares(): array
    {
        return $this->appMiddlewares;
    }

    public function getAppMiddlewareAliases(): array
    {
        return array_keys($this->appMiddlewares);
    }

    public function getAppMiddlewareHandlers(): array
    {
        $result = [];
        foreach ($this->appMiddlewares as $key => $value) {
            if ($value === true) {
                $result[] = $this->getMiddlewareHandler($key);
            }
        }
        return $result;
    }
}
