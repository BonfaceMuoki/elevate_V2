<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserIniviteOneTimeLink extends Model
{
    use HasFactory;
    protected $table = "user_inivite_onetime_links";
    protected $fillable = ['user_id', 'invite_token', 'invite_count','is_sponsorship'];
}
