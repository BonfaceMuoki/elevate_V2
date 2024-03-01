<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Currency;
use App\Models\ProductImage;
use App\Models\Supplier;
use App\Models\SupplierProduct;
use App\Traits\FileUploadTrait;
use DB;
use Exception;
use Illuminate\Http\Request;

class SupplierService
{
    use FileUploadTrait;

    public function saveSupplier(Request $request, $action)
    {
        $objecttosave['supplier_name'] = $request->supplier_name;
        $objecttosave['supplier_email'] = $request->supplier_email;
        $objecttosave['supplier_phone'] = $request->supplier_phone;
        $objecttosave['shop_location_descriptions'] = $request->location_description;
        $objecttosave['about_supplier'] = $request->about_supplier;
        $objecttosave['generated_supplier_name'] = $this->generateSupplierName($request->supplier_phone);
        try {
            DB::beginTransaction();
            if ($action == "add") {
                $supplier = Supplier::create($objecttosave);
                DB::commit();
                return response()->json(['message' => "Saved successfully", 'created_supplier' => $supplier], 200);
            } else if ($action == "update") {
                $suppliertoup = Supplier::findOrFail($request->supplier);
                $suppliertoup->update($objecttosave);
                $supp = Supplier::where("id", $request->supplier)->first();
                DB::commit();
                return response()->json(['message' => "updated successfully", 'updated_supplier' => $supp], 200);
            }
        } catch (Exception $exp) {
            DB::rollBack();
            return response()->json(['message' => "Failed.Please contact Admin. " . $exp->getMessage(), 'data' => $request->all()], 400);
        }
    }
    public function conditionalSavingOfCategory($category)
    {
        $categoryArray = array();
        $categoryModel = null;

        $found = Category::where("category_name", $category)->count();

        if ($found > 0) {
            $categoryModel = Category::where("category_name", $category)->first();
        } else {
            $categoryModel = Category::create(['category_name' => $category]);
        }
        return $categoryModel->id;

    }
    public function getCurrencyID($currency)
    {
        $categoryModel = Currency::where("currency_label", $currency)->first();
        return $categoryModel->id;
    }
    public function saveProductImages()
    {

    }
    public function saveSupplierProduct(Request $request, $action)
    {

        // return response()->json(['message' => ], 200);
        $objecttosave['product_name'] = $request->product_name;
        $objecttosave['category_id'] = $this->conditionalSavingOfCategory($request->category);
        $objecttosave['sku_name'] = $request->sku_name;
        $objecttosave['quantity_available'] = $request->quantity_available;
        $objecttosave['price'] = $request->price;
        $objecttosave['currency_id'] = $this->getCurrencyID($request->currency);
        $objecttosave['quantity_cap'] = $request->quantity_cap;
        $objecttosave['about_product'] = $request->about_product;
        $objecttosave['supplier_id'] = $request->supplier;

        try {
            DB::beginTransaction();
            if ($action == "add") {
                $ex = SupplierProduct::where(['product_name' => $request->product_name, 'supplier_id' => $request->supplier])->count();
                if ($ex > 0) {
                    return response()->json(['message' => 'Producct already exist.'], 200);
                }

                //save product images
                $filePaths = [];
                if ($request->hasFile("product_images")) {
                    $allowedTypes = ['jpeg,jpg,png'];
                    $maxSize = 5000000;
                    $uploadedFiles = $request->file('product_images');
                    $folder = "product_images";
                    $filePaths = $this->uploadFiles($uploadedFiles, $folder, $allowedTypes, $maxSize);

                }
                // save product images
                $supplierproduct = SupplierProduct::create($objecttosave);
                //create images on the db
                if ((sizeof($filePaths) > 0) && $filePaths['status'] == 1) {
                    foreach ($filePaths['paths'] as $filepath) {

                        $imgtosave['product_id'] = $supplierproduct->id;
                        $imgtosave['image_url'] = $filepath;
                        $imgtosave['captions'] = '';
                        $rec = ProductImage::create($imgtosave);
                    }
                }
                //create images on the db
                DB::commit();
                return response()->json(['message' => 'Product created successfully.'], 200);

            } else if ($action == "update") {
                $suppliertoup = SupplierProduct::findOrFail($request->product);
                $suppliertoup->update($objecttosave);
                //save product images
                $filePaths = [];
                if ($request->hasFile("product_images")) {
                    $allowedTypes = ['jpeg,jpg,png'];
                    $maxSize = 5000000;
                    $uploadedFiles = $request->file('product_images');
                    $folder = "product_images";
                    $filePaths = $this->uploadFiles($uploadedFiles, $folder, $allowedTypes, $maxSize);

                }
                // save product images

                //create images on the db
                if ((sizeof($filePaths) > 0) && $filePaths['status'] == 1) {
                    foreach ($filePaths['paths'] as $filepath) {

                        $imgtosave['product_id'] = $request->product;
                        $imgtosave['image_url'] = $filepath;
                        $imgtosave['captions'] = '';
                        $rec = ProductImage::create($imgtosave);
                    }
                }
                //create images on the db
                $supp = SupplierProduct::where("id", $request->supplier)->first();
                DB::commit();
                return response()->json(['message' => "updated successfully", 'updated_supplier' => $supp], 200);

            }
        } catch (Exception $exp) {
            DB::rollBack();
            return response()->json(['message' => "Failed.Please contact Admin. " . $exp->getMessage(), 'data' => $request->all()], 400);
        }
    }
    public function generateSupplierName($supplierphone)
    {
        $phonesubstring = substr($supplierphone, 0, 6);
        $supplier = Supplier::latest()->first();
        $latestid = 0;
        if ($supplier == null) {
            $latestid = 0 + 1;
        } else {
            $latestid = 1 + intVal($supplier->id);
        }

        return "supplier_" . intVal($phonesubstring) - $latestid;
    }
    public function deleteSupplierProduct(Request $request)
    {
        $product = SupplierProduct::findOrFail($request->product);
        if ($product->delete()) {
            return response()->json(['message' => "Deleted Successfully"], 200);
        }

    }
}
