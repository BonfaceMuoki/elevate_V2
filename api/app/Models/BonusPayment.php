<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonusPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount_paid',
        'paid_by',
        'bonus_for',
        'payment_id',
        'payment_status',
        'used_payment_method',
        'used_wallet',
    ];
    protected $appends = [
        'recipient',
    ];

    public function payer()
    {
        return $this->belongsTo(User::class, "paid_by");
    }
    public function getRecipientAttribute()
    {
        // Fetch or compute data based on the model's properties
        $paybacks = DB::table('bonus_payments')
            ->join("system_user_invites", "system_user_invites.completed_user_id", "=", "bonus_payments.paid_by")
            ->join("users", "users.id", "=", "system_user_invites.invited_by")
            ->leftJoin("contributor_accounts", "contributor_accounts.user_id", "=", "users.id")
            ->where("system_user_invites.completed_user_id", $this->paid_by)
            ->select("bonus_payments.*", "users.full_name", "users.email", "users.status", "contributor_accounts.wallet_id", "contributor_accounts.payment_method")->get();
        return $paybacks;
    }
}
