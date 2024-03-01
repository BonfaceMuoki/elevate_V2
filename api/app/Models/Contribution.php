<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable=[
        'user_id',
        'tier_id',
        'payback_paid_total',
        'payback_count',
        'admin_approved',
        'status',
        'contribution_amount',
        'payment_id'
    ];
    // protected $append=['pay_back_entry'];
    protected $appends = [
        'pay_back_entries'
    ];
    
    public function contributionTier(){
        return $this->belongsTo(MatrixOption::class,"tier_id");
    }
    public function user(){
        return $this->belongsTo(User::class,"user_id");
    }
    public function getPayBackEntriesAttribute()
    {
        // Fetch or compute data based on the model's properties
        $paybacks = DB::table('contribution_paybacks')
            ->join("contributions", "contributions.id", "=", "contribution_paybacks.contribution_id_paying_payback")
            ->join("users", "users.id", "=", "contributions.user_id")
            ->where("contribution_paybacks.contribution_id_reciving_payback", $this->id)
            ->select("contributions.*","contribution_paybacks.*","users.full_name")->get();        
        return $paybacks;
    }
}
