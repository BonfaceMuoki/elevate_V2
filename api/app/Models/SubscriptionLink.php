<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionLink extends Model
{
    use HasFactory;
    protected $table="subscription_links";
    protected $fillable = [
        'link',
        'owned_by_organisation_name',
        'status',
        'monthly_subscription_amount',
        'annual_subscription_amount',
        'description',
        'subscription_tier_level'
    ];
    public function usersLinks(){
        return $this->hasMany(UserSubscriptionLink::class,"subscriplink_link_id");
    }
    public function tier(){
        return $this->belongsTo(MatrixOption::class,"subscription_tier_level");
    }
}
