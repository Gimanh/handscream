<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\StreamInterface;
use ZXC\Interfaces\Psr\Http\Message\UploadedFileInterface;
use ZXC\Interfaces\Psr\Http\Message\UploadedFileFactoryInterface;
use const UPLOAD_ERR_OK;


class UploadedFileFactory implements UploadedFileFactoryInterface
{

    public function createUploadedFile(
        StreamInterface $stream,
        int $size = null,
        int $error = UPLOAD_ERR_OK,
        string $clientFilename = null,
        string $clientMediaType = null
    ): UploadedFileInterface
    {
        return new UploadedFile($stream, $size, $error, $clientFilename, $clientMediaType);
    }
}
