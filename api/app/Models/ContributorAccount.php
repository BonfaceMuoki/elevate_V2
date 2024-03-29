<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributorAccount extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'wallet_id', 'payment_method','bank_name','bank_branch_name','bank_account_number','bank_account_holder'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
