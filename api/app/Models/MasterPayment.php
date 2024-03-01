<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterPayment extends Model
{
    use HasFactory;
    

    protected $fillable=[
        'description',
        'amount_paid',
        'user_id',
        'payment_proof',
        'status'
    ];
    public function Bonuses(){
        return $this->hasMany(BonusPayment::class,"payment_id");
    }
    public function CompanyPayments(){
        return $this->hasMany(CompanyReceivedPayment::class,"payment_id");
    }
    public function MatrixPayments(){
        return $this->hasMany(Contribution::class,"payment_id")->with("contributionTier");
    }
    public function User(){
        return $this->belongsTo(User::class,"user_id");
    }
}
