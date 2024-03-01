<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_owner_id',
        'total_order_cost',
        'tax',
        'order_balance',
        'payment_status',
        'delivery_status',
        'order_descriptions',
    ];
    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class, "order_id")->with("product");
    }
    public function Owner()
    {
        return $this->belongsTo(User::class, "order_owner_id");
    }
}
