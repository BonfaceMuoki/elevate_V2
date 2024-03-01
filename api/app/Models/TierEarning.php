<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TierEarning extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'tier_id', 'total_earnings_so_far', 'subscription_used_amount', 'withdraw_amount', 'status', 'used_payment_method', 'used_wallet'];
    public function user()
    {
        return $this->belongsTo(User::class)->with('userAccount');
    }
    public function tier()
    {
        return $this->belongsTo(MatrixOption::class, 'tier_id');
    }
}
