<?php


namespace ZXC\Native\PSR;


use Exception;
use RuntimeException;
use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\StreamInterface;


class Stream implements StreamInterface
{

    /**
     * @var resource
     */
    protected $resource = null;
    /**
     * @var string|resource
     */
    protected $sourceStream = null;
    /**
     * @var string
     */
    protected $messageInvalidStream = 'Invalid stream ';
    /**
     * @var string
     */
    protected $messageInvalidResource = 'Invalid resource ';

    /** @var array Hash table of readable and writeable stream types for fast lookups */
    protected static $readWriteHash = array(
        'read' => array(
            'r' => true, 'w+' => true, 'r+' => true, 'x+' => true, 'c+' => true,
            'rb' => true, 'w+b' => true, 'r+b' => true, 'x+b' => true, 'c+b' => true,
            'rt' => true, 'w+t' => true, 'r+t' => true, 'x+t' => true, 'c+t' => true, 'a+' => true
        ),
        'write' => array(
            'w' => true, 'w+' => true, 'rw' => true, 'r+' => true, 'x+' => true, 'c+' => true,
            'wb' => true, 'w+b' => true, 'r+b' => true, 'x+b' => true, 'c+b' => true,
            'w+t' => true, 'r+t' => true, 'x+t' => true, 'c+t' => true, 'a' => true, 'a+' => true
        )
    );

    public function __construct($sourceStream = 'php://memory', $mode = 'r')
    {
        $this->attach($sourceStream, $mode);
    }

    public function attach($sourceStream, $mode)
    {
        $this->sourceStream = $sourceStream;
        if (is_resource($sourceStream)) {
            $this->resource = $sourceStream;
        } elseif (is_string($sourceStream)) {
            $this->resource = fopen($sourceStream, $mode);
        } else {
            throw new InvalidArgumentException($this->messageInvalidStream);
        }
    }

    /**
     * Reads all data from the stream into a string, from the beginning to end.
     *
     * This method MUST attempt to seek to the beginning of the stream before
     * reading data and read the stream until the end is reached.
     *
     * Warning: This could attempt to load a large amount of data into memory.
     *
     * This method MUST NOT raise an exception in order to conform with PHP's
     * string casting operations.
     *
     * @see http://php.net/manual/en/language.oop5.magic.php#object.tostring
     * @return string
     */
    public function __toString()
    {
        if (!$this->isReadable()) {
            return '';
        }
        try {
            $this->rewind();
            return $this->getContents();
        } catch (Exception $exception) {
            return $exception->getMessage();
        }
    }

    /**
     * Closes the stream and any underlying resources.
     * @link http://php.net/manual/en/function.fclose.php
     * @return void
     */
    public function close()
    {
        if ($this->resource) {
            fclose($this->detach());
        }
    }

    /**
     * Separates any underlying resources from the stream.
     *
     * After the stream has been detached, the stream is in an unusable state.
     *
     * @return resource|null Underlying PHP stream, if any
     */
    public function detach()
    {
        $newResource = $this->resource;
        $this->resource = null;
        $this->sourceStream = null;
        return $newResource;
    }

    /**
     * Get the size of the stream if known.
     * @link http://php.net/manual/en/function.fstat.php
     * @return int|null Returns the size in bytes if known, or null if unknown.
     */
    public function getSize()
    {
        if (!is_resource($this->resource)) {
            return null;
        }
        $stats = fstat($this->resource);
        $size = $stats['size'];
        return $size;
    }

    /**
     * Returns the current position of the file read/write pointer
     * @link http://php.net/manual/en/function.ftell.php
     * @return int Position of the file pointer
     * @throws RuntimeException on error.
     */
    public function tell()
    {
        if (!is_resource($this->resource)) {
            throw new RuntimeException($this->messageInvalidResource);
        }
        $ftell = ftell($this->resource);
        if (!is_int($ftell)) {
            throw new RuntimeException('ftell() error');
        }
        return $ftell;
    }

    /**
     * Returns true if the stream is at the end of the stream.
     * @link http://php.net/manual/en/function.feof.php
     * @return bool
     */
    public function eof()
    {
        if (!is_resource($this->resource)) {
            return true;
        }
        return feof($this->resource);
    }

    /**
     * Returns whether or not the stream is seekable.
     * @link http://php.net/manual/en/function.stream-get-meta-data.php
     * @return bool
     */
    public function isSeekable()
    {
        if (!is_resource($this->resource)) {
            return false;
        }
        $metaData = stream_get_meta_data($this->resource);
        return $metaData['seekable'];
    }

    /**
     * Seek to a position in the stream.
     *
     * @link http://www.php.net/manual/en/function.fseek.php
     * @param int $offset Stream offset
     * @param int $whence Specifies how the cursor position will be calculated
     *     based on the seek offset. Valid values are identical to the built-in
     *     PHP $whence values for `fseek()`.  SEEK_SET: Set position equal to
     *     offset bytes SEEK_CUR: Set position to current location plus offset
     *     SEEK_END: Set position to end-of-stream plus offset.
     * @throws RuntimeException on failure.
     */
    public function seek($offset, $whence = SEEK_SET)
    {
        if (!is_resource($this->resource)) {
            throw new RuntimeException('Invalid resource');
        }
        if (!$this->isSeekable()) {
            throw new RuntimeException('Resource is not seekable');
        }
        fseek($this->resource, $offset, $whence);
    }

    /**
     * Seek to the beginning of the stream.
     *
     * If the stream is not seekable, this method will raise an exception;
     * otherwise, it will perform a seek(0).
     *
     * @throws RuntimeException on failure.
     * @link http://www.php.net/manual/en/function.fseek.php
     * @see seek()
     */
    public function rewind()
    {
        $this->seek(0);
    }

    /**
     * Returns whether or not the stream is writable.
     *
     * @return bool
     */
    public function isWritable()
    {
        if (!is_resource($this->resource)) {
            return false;
        }
        $metaData = stream_get_meta_data($this->resource);
        return isset(static::$readWriteHash['write'][$metaData['mode']]);
    }

    /**
     * Write data to the stream.
     *
     * @param string $string The string that is to be written.
     * @return int Returns the number of bytes written to the stream.
     * @throws RuntimeException on failure.
     */
    public function write($string)
    {
        if (!is_resource($this->resource)) {
            throw new RuntimeException('Invalid resource');
        }
        if (!$this->isWritable()) {
            throw new RuntimeException('Resource is not writable');
        }
        $writeResult = fwrite($this->resource, $string);
        if ($writeResult === false) {
            throw new RuntimeException('fwrite() error');
        }
        return $writeResult;
    }

    /**
     * Returns whether or not the stream is readable.
     * @link http://php.net/manual/en/function.fopen.php
     * @link http://php.net/manual/en/function.stream-get-meta-data.php
     * @return bool
     */
    public function isReadable()
    {
        if (!is_resource($this->resource)) {
            return false;
        }
        $metaData = stream_get_meta_data($this->resource);
        $mode = $metaData['mode'];
        return isset(static::$readWriteHash['read'][$mode]);
    }

    /**
     * Read data from the stream.
     * @link http://php.net/manual/en/function.fread.php
     * @param int $length Read up to $length bytes from the object and return
     *     them. Fewer than $length bytes may be returned if underlying stream
     *     call returns fewer bytes.
     * @return string Returns the data read from the stream, or an empty string
     *     if no bytes are available.
     * @throws RuntimeException if an error occurs.
     */
    public function read($length)
    {
        if (!is_resource($this->resource)) {
            throw new RuntimeException('Invalid resource');
        }
        if (!$this->isReadable()) {
            throw new RuntimeException('Unreadable stream');
        }
        $resultContent = fread($this->resource, $length);
        if ($resultContent === false) {
            throw new RuntimeException('fread() error');
        }
        return $resultContent;
    }

    /**
     * Returns the remaining contents in a string
     *
     * @return string
     * @throws RuntimeException if unable to read or an error occurs while
     *     reading.
     */
    public function getContents()
    {
        if (!$this->isReadable()) {
            return '';
        }
        $resultContent = stream_get_contents($this->resource);
        if ($resultContent === false) {
            return '';
        }
        return $resultContent;
    }

    /**
     * Get stream metadata as an associative array or retrieve a specific key.
     *
     * The keys returned are identical to the keys returned from PHP's
     * stream_get_meta_data() function.
     *
     * @link http://php.net/manual/en/function.stream-get-meta-data.php
     * @param string $key Specific metadata to retrieve.
     * @return array|mixed|null Returns an associative array if no key is
     *     provided. Returns a specific key value if a key is provided and the
     *     value is found, or null if the key is not found.
     */
    public function getMetadata($key = null)
    {
        $metaData = stream_get_meta_data($this->resource);
        if ($key === null) {
            return $metaData;
        }
        if (!array_key_exists($key, $metaData)) {
            return null;
        }
        return $metaData[$key];
    }

    /**
     * @return resource|string
     */
    public function getSourceStream()
    {
        return $this->sourceStream;
    }
}
