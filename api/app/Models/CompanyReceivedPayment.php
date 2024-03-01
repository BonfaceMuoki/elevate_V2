<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyReceivedPayment extends Model
{
    use HasFactory;
    protected $fillable = [
        'amount_paid',
        'paid_by',
        'paid_as',
        'status',
        'payment_proof',
        'payment_id',
    ];
    public function payer()
    {
        return $this->belongsTo(User::class, "paid_by");
    }
}
