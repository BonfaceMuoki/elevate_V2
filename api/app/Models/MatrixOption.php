<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatrixOption extends Model
{
    use HasFactory;
    protected $fillable = [
        'tier_name',
        'club',
        'contribution_amount',
        'payback_amount',
        'minimum_progression_count',
        'minimum_progression_amount',
        'payback_count',
        'order_level',
        'reinvestment',
        'withdrawal',
        'subscription_amount',
        'elevate_company_amount',
        'matrix_amount',
        'recruitment_amount',
    ];
    public function Contributions()
    {
        return $this->hasMany(Contribution::class, "tier_id");
    }
    public function SubscriptionLink()
    {
        return $this->hasMany(SubscriptionLink::class);

    }
    public function tierEarnings()
    {
        return $this->hasMany(TierEarning::class);
    }

}
