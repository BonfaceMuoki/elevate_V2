<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SupplierProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $images = $this->productImage;
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'sku_name' => $this->sku_name,
            'quantity_available' => $this->quantity_available,
            'price' => $this->price,
            'tax' => $this->tax,
            'currency_id' => $this->currency_id,
            'currency' => $this->currency,
            'quantity_cap' => $this->quantity_cap,
            'status' => $this->status,
            'about_product' => $this->about_product,
            'supplier_id' => $this->supplier_id,
            'supplier' => $this->supplier,
            'category_id' => $this->category_id,
            'category' => $this->category,
            'default_image' => $images[0],
            'product_images' => $this->productImage,

        ];
    }
}
