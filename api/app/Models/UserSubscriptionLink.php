<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSubscriptionLink extends Model
{
    use HasFactory;
    protected $fillable=['user_id','subscriplink_link_id','link_value','owner_subscription_length','owner_subscription_amount'];
    public function associatedParentLink(){
        return $this->belongsTo(SubscriptionLink::class,"subscriplink_link_id");
    }
}
