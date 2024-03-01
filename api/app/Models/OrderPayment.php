<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'payment_method',
        'amount_paid',
        'transaction_id',
        'payment_proof',
    ];
}
