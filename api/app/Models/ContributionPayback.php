<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributionPayback extends Model
{
    use HasFactory;
    protected $fillable=[
        'contribution_id_reciving_payback',
        'contribution_id_paying_payback',
        'payment_status'
    ];
}
