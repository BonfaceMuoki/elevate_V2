<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributorAccount extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'wallet_id', 'payment_method'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
