<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidBase64Image implements ValidationRule
{
    protected $maxSize;
    protected $allowedMimeTypes;

    public function __construct(int $maxSizeInMB = 5, array $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
    {
        $this->maxSize = $maxSizeInMB * 1024 * 1024; // Convert MB to bytes
        $this->allowedMimeTypes = $allowedMimeTypes;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Allow null/empty values (use 'required' rule separately if needed)
        if (empty($value)) {
            return;
        }

        // Check if it's a valid base64 string with data URI scheme
        if (!preg_match('/^data:image\/(\w+);base64,/', $value, $matches)) {
            $fail('The :attribute must be a valid base64 encoded image.');
            return;
        }

        // Extract mime type from data URI
        $mimeType = 'image/' . $matches[1];

        // Validate mime type
        if (!in_array($mimeType, $this->allowedMimeTypes)) {
            $allowedTypes = implode(', ', array_map(function($type) {
                return str_replace('image/', '', $type);
            }, $this->allowedMimeTypes));
            $fail("The :attribute must be one of the following types: {$allowedTypes}.");
            return;
        }

        // Remove the data URI prefix to get pure base64
        $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $value);

        // Validate base64 encoding
        if (!base64_decode($base64Data, true)) {
            $fail('The :attribute contains invalid base64 data.');
            return;
        }

        // Decode and check file size
        $decodedData = base64_decode($base64Data);
        $fileSize = strlen($decodedData);

        if ($fileSize > $this->maxSize) {
            $maxSizeMB = $this->maxSize / (1024 * 1024);
            $fail("The :attribute must not exceed {$maxSizeMB}MB.");
            return;
        }

        // Additional security check: verify it's actually an image
        $imageInfo = @getimagesizefromstring($decodedData);
        if ($imageInfo === false) {
            $fail('The :attribute is not a valid image file.');
            return;
        }

        // Verify mime type matches actual image type
        $actualMimeType = $imageInfo['mime'];
        if ($actualMimeType !== $mimeType) {
            $fail('The :attribute mime type does not match the actual image type.');
            return;
        }

        // Check image dimensions (optional - prevent extremely large images)
        $width = $imageInfo[0];
        $height = $imageInfo[1];
        $maxDimension = 4096; // 4K resolution max

        if ($width > $maxDimension || $height > $maxDimension) {
            $fail("The :attribute dimensions must not exceed {$maxDimension}x{$maxDimension} pixels.");
            return;
        }

        // Check for potential malicious content in EXIF data
        // This is a basic check - for production, consider using a dedicated security library
        if (function_exists('exif_read_data')) {
            $tempFile = tempnam(sys_get_temp_dir(), 'img_validation_');
            file_put_contents($tempFile, $decodedData);
            
            try {
                @exif_read_data($tempFile);
            } catch (\Exception $e) {
                unlink($tempFile);
                $fail('The :attribute contains potentially malicious data.');
                return;
            }
            
            unlink($tempFile);
        }
    }
}

