<?php

namespace ZXC\Native\JWT;

use DateTimeInterface;
use ZXC\Native\JWT\Exceptions\InvalidAlgorithm;
use ZXC\Native\JWT\Exceptions\InvalidJWTToken;
use ZXC\Native\JWT\Exceptions\OpenSSLError;

class JWTToken
{
    public static $supported = [
        'HS256' => ['ext' => 'hash_hmac', 'alg' => 'SHA256'],
        'HS384' => ['ext' => 'hash_hmac', 'alg' => 'SHA384'],
        'HS512' => ['ext' => 'hash_hmac', 'alg' => 'SHA512'],
        'RS256' => ['ext' => 'openssl', 'alg' => 'SHA256'],
        'RS384' => ['ext' => 'openssl', 'alg' => 'SHA384'],
        'RS512' => ['ext' => 'openssl', 'alg' => 'SHA512'],
    ];

    /**
     * @param $payload
     * @param string $privateKey
     * @param string $alg
     * @return string
     * @throws InvalidAlgorithm
     * @throws OpenSSLError
     */
    public static function encode($payload, string $privateKey, string $alg = 'HS256'): string
    {
        $jwt = [];
        $jwt[] = self::base64UrlEncode(self::jsonEncode(['alg' => $alg, 'typ' => 'JWT']));
        $jwt[] = self::base64UrlEncode(self::jsonEncode($payload));
        $jwt[] = self::base64UrlEncode(self::sign(implode('.', $jwt), $privateKey, $alg));
        return implode('.', $jwt);
    }

    /**
     * @param string $jwt
     * @param string $privateKey
     * @return mixed
     * @throws InvalidAlgorithm
     * @throws InvalidJWTToken
     */
    public static function decode(string $jwt, string $privateKey)
    {
        $timestamp = time();
        $jwtSections = explode('.', $jwt);
        if (count($jwtSections) !== 3) {
            throw new InvalidJWTToken('Invalid count of sections');
        }
        $header = self::jsonDecode(self::base64UrlDecode($jwtSections[0]));
        $payload = self::jsonDecode(self::base64UrlDecode($jwtSections[1]));
        $sign = self::base64UrlDecode($jwtSections[2]);
        if ($header === null) {
            throw new InvalidJWTToken('Invalid header');
        }
        if ($payload === null) {
            throw new InvalidJWTToken('Invalid payload');
        }
        if ($sign === false) {
            throw new InvalidJWTToken('Invalid sign');
        }
        if (!isset($header['alg'])) {
            throw new InvalidAlgorithm('Alg is empty');
        }
        if (!isset(self::$supported[$header['alg']])) {
            throw new InvalidAlgorithm('Algorithm not supported');
        }
        $body = $jwtSections[0] . '.' . $jwtSections[1];

        if (!self::verify($body, $sign, $privateKey, $header['alg'])) {
            throw new InvalidJWTToken('Can not verify sign');
        }

        if (isset($payload['nbf']) && $payload['nbf'] > $timestamp) {
            throw new InvalidJWTToken(
                'Token will be valid after ' . date(DateTimeInterface::ISO8601, $payload['nbf'])
            );
        }

        if (isset($payload['iat']) && $payload['iat'] > $timestamp) {
            throw new InvalidJWTToken(
                'Token will be valid after ' . date(DateTimeInterface::ISO8601, $payload['iat'])
            );
        }

        if (isset($payload['exp']) && $timestamp >= $payload['exp']) {
            throw new InvalidJWTToken('Expired token');
        }

        return $payload;
    }

    /**
     * @param string $msg
     * @param $privateKey
     * @param string $alg
     * @return false|string
     * @throws InvalidAlgorithm
     * @throws OpenSSLError
     */
    public static function sign(string $msg, $privateKey, $alg = 'HS256')
    {
        if (!isset(self::$supported[$alg])) {
            throw new InvalidAlgorithm('Algorithm ' . $alg . ' not supported');
        }

        $hashInfo = self::$supported[$alg];
        if ($hashInfo['ext'] === 'hash_hmac') {
            return hash_hmac($hashInfo['alg'], $msg, $privateKey, true);
        }

        if ($hashInfo['ext'] === 'openssl') {
            $signature = '';
            $success = openssl_sign($msg, $signature, $privateKey, $hashInfo['alg']);
            if ($success) {
                return $signature;
            }
            throw new OpenSSLError('OpenSSL unable to sign data');
        }
        throw new InvalidAlgorithm('Can not find extension for sign');
    }

    public static function base64UrlEncode($string)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($string));
    }

    public static function base64UrlDecode($string)
    {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $string));
    }

    public static function jsonEncode($value)
    {
        return json_encode($value);
    }

    public static function jsonDecode($value)
    {
        return json_decode($value, true);
    }

    /**
     * @param $jwtMsg
     * @param $sign
     * @param $secretOrPublicKey
     * @param $alg
     * @return bool
     * @throws InvalidAlgorithm
     * @throws OpenSSLError
     */
    public static function verify($jwtMsg, $sign, $secretOrPublicKey, $alg): bool
    {
        $hashInfo = self::$supported[$alg];
        if ($hashInfo['ext'] === 'openssl') {
            $success = openssl_verify($jwtMsg, $sign, $secretOrPublicKey, $hashInfo['alg']);
            switch ($success) {
                case 1:
                    return true;
                case 0:
                    return false;
                default:
                    throw new OpenSSLError('OpenSSL error: ' . openssl_error_string());
            }
        } else {
            $computedSign = self::sign($jwtMsg, $secretOrPublicKey, $alg);
            if (!hash_equals($sign, $computedSign)) {
                return false;
            }
        }
        return true;
    }
}
