<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
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
    protected $appends=['one_time_invite_record'];
    public function Invitee()
    {
        return $this->belongsTo(User::class);
    }
    public function getOneTimeInviteRecordAttribute(){
       $records=DB::table("system_user_invites")
       ->join("user_inivite_onetime_links","user_inivite_onetime_links.invite_token","=","system_user_invites.invite_token")
       ->where("user_inivite_onetime_links.invite_token",$this->invite_token)
       ->select("user_inivite_onetime_links.*")->limit(1)->get();
       return $records;
    }
}