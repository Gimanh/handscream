<?php


namespace ZXC\Native\PSR;


use RuntimeException;
use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\StreamInterface;
use ZXC\Interfaces\Psr\Http\Message\UploadedFileInterface;


class UploadedFile implements UploadedFileInterface
{

    /**
     * @var
     */
    protected $file;
    /**
     * @var StreamInterface
     */
    protected $stream;
    /**
     * @var integer
     */
    protected $size;
    /**
     * @var bool
     */
    protected $moved = false;
    /**
     * @var integer
     */
    protected $error;
    /**
     * @var string | null | bool
     */
    protected $sapi = false;
    /**
     * @var string
     */
    protected $clientFilename;
    /**
     * @var string
     */
    protected $clientMediaType;

    /**
     * UploadedFile constructor.
     * @param string|resource|StreamInterface $streamOrFile
     * @param int $size
     * @param int $error
     * @param null $clientFilename
     * @param null $clientMediaType
     */
    //TODO add types
    public function __construct($streamOrFile, $size = 0, $error = UPLOAD_ERR_OK, $clientFilename = null, $clientMediaType = null)
    {
        $this->error = $error;
        $this->size = $size;

        if (!is_string($clientFilename)) {
            throw new InvalidArgumentException('Invalid $clientFilename argument must be string');
        }

        if (!is_string($clientMediaType)) {
            throw new InvalidArgumentException('Invalid $clientMediaType argument must be string');
        }

        $this->clientFilename = $clientFilename;
        $this->clientMediaType = $clientMediaType;
        $this->sapi = PHP_SAPI;
        if ($this->error === UPLOAD_ERR_OK) {
            if (is_string($streamOrFile)) {
                $this->file = $streamOrFile;
            } elseif (is_resource($streamOrFile)) {
                $this->stream = new Stream($streamOrFile);
            } elseif ($streamOrFile instanceof StreamInterface) {
                $this->stream = $streamOrFile;
            } else {
                throw new InvalidArgumentException('Invalid stream or file provided for UploadedFile');
            }
        }
    }

    public function getStream()
    {
        if ($this->moved) {
            throw new RuntimeException('The file has already moved.');
        }

        if ($this->stream instanceof StreamInterface) {
            return $this->stream;
        }

        $this->stream = new Stream($this->file);

        return $this->stream;
    }

    public function moveTo($targetPath)
    {
        if ($this->moved) {
            throw new RuntimeException('The file has already moved.');
        }

        if ($this->file) {
            if ($this->sapi == 'cli') {
                if (rename($this->file, $targetPath) === false) {
                    throw new RuntimeException('Unable to write to designated path');
                }

            } else {
                if (move_uploaded_file($this->file, $targetPath) === false) {
                    throw new RuntimeException('Unable to write to designated path');
                }
            }
            $this->moved = true;
        } else {
            $resource = fopen($targetPath, 'wb+');
            if ($resource === false) {
                throw new RuntimeException('Unable to fopen ' . $targetPath);
            }
            $this->stream->rewind();
            while (!$this->stream->eof()) {
                fwrite($resource, $this->stream->read(4096));
            }
            fclose($resource);
            $this->moved = true;
        }
    }

    public function getSize()
    {
        return $this->size;
    }

    public function getError()
    {
        return $this->error;
    }

    public function getClientFilename()
    {
        return $this->clientFilename;
    }

    public function getClientMediaType()
    {
        return $this->clientMediaType;
    }

    /**
     * @param bool|string|null $sapi
     */
    public function setSapi($sapi)
    {
        $this->sapi = $sapi;
    }
}
