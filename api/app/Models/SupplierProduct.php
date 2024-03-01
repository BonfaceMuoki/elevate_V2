<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupplierProduct extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'supplier_id',
        'category_id',
        'product_name',
        'sku_name',
        'quantity_available',
        'price',
        'tax',
        'currency_id',
        'quantity_cap',
        'status',
        'about_product',
    ];
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, "supplier_id");
    }
    public function currency()
    {
        return $this->belongsTo(Currency::class, "currency_id");
    }
    public function category()
    {
        return $this->belongsTo(Category::class, "category_id");
    }
    public function productImage()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class, "product_id");
    }
}
