<?php
namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Storage;

trait FileUploadTrait
{

    public function uploadFile($file, $folder, $allowedtypes)
    {
        try {
            $this->validateUpload($file, $allowedtypes);
            $newFileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->store($folder, $newFileName, 'public');
            return $path;
        } catch (Exception $exception) {
            return $exception->getMessage();
        }

    }
    public function uploadFiles($files, $folder, $allowedtypes, $maxsize)
    {
        try {
            $paths = [];
            foreach ($files as $file) {
                $this->validateUpload($file, $allowedtypes);
                $newFileName = time() . '_' . $file->getClientOriginalName();
                $newFileName = $this->generate_imageName($file->getClientOriginalName(), "product_image") . "." . $file->getClientOriginalExtension();
                $path = Storage::disk('public')->putFileAs($folder, $file, $newFileName);
                array_push($paths, $path);
            }
            return ['status' => 1, 'paths' => $paths];
        } catch (Exception $exception) {

            return ['status' => 0, 'paths' => $paths, 'error' => $exception->getMessage()];

        }
    }

    protected function validateUpload(UploadedFile $file, $allowedtypes)
    {
        // if (!in_array($file->getClientOriginalExtension(), $allowedtypes)) {
        //     throw new \Exception('Invalid file type.');
        // }
        // if ($file->getSize() > $maxSizeInBytes) {
        //     throw new \Exception('File size exceeds the limit.');
        // }
    }
    public function generate_imageName($originalname, $keyword)
    {
        return $keyword . "_" . time() . $originalname;
    }
}
