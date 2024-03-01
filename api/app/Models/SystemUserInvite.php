<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemUserInvite extends Model
{
    use HasFactory;
    protected $fillable = [
        'invited_by',
        'invite_token',
        'registration_link',
        'invite_name',
        'invite_email',
        'invite_phone',
        'completed',
        'completion_user_id',
        'completed_user_id',

    ];
    public function Invitee()
    {
        return $this->belongsTo(User::class);
    }
}