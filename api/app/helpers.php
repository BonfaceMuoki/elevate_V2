<?php
if (!function_exists('generate_imageName')) {
    function generate_imageName($originalname, $prefix = "")
    {
        return $prefix . "_" . time();
    }
}
