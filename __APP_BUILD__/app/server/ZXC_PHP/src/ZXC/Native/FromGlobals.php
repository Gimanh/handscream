<?php


namespace ZXC\Native;


use ZXC\Native\PSR\UriFactory;
use ZXC\Interfaces\Psr\Http\Message\UriInterface;


class FromGlobals
{
    public static function getUri(): UriInterface
    {
        if (isset($_SERVER['REQUEST_URI'])) {
            $uri = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")
                . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            return (new UriFactory)->createUri($uri);
        } else {
            return (new UriFactory)->createUri('');
        }
    }

    public static function getMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? '';
    }

    public static function getServerParams(): array
    {
        return $_SERVER;
    }

    public static function getPost(): array
    {
        return $_POST;
    }

    public static function getGet(): array
    {
        return $_GET;
    }

    public static function getCookie(): array
    {
        return $_COOKIE;
    }

    public static function getFiles(): array
    {
        return $_FILES;
    }

    public static function getIp()
    {
        // Get real visitor IP behind CloudFlare network
        if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
            $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
            $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
        }
        $client = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote = @$_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        } else {
            $ip = $remote;
        }

        return $ip;
    }
}
