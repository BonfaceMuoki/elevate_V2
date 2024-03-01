<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'product_id',
        'total_product_cost',
        'total_product_tax',
        'quantity_bought',
        'total_product_vat',
        'payment_status',
        'delivery_status',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, "order_id");
    }
    public function product()
    {
        return $this->belongsTo(SupplierProduct::class)->with("supplier");
    }
}
