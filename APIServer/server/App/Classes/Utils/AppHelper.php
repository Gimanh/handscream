<?php

namespace App\Classes\Utils;

class AppHelper
{
    public static function mergeAssocArrays($array, $newArray)
    {
        foreach ($newArray as $key => $value) {
            if (is_array($value)) {
                $array[$key] = self::mergeAssocArrays($array[$key], $value);
            } else {
                $array[$key] = $value;
            }
        }
        return $array;
    }
}
