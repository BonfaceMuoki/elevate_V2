<?php

namespace App\Models;

use App\Permissions\HasPermissionsTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasPermissionsTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'profile_pic',
        'phone_number',
        'email',
        'password',
        'is_active',
    ];
    protected $with = ['userOneTimeInviteLinks'];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    // protected $with=['Invites'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function Invites()
    {
        return $this->hasMany(SystemUserInvite::class, "invited_by");
    }
    public function payments()
    {
        return $this->hasMany(MasterPayment::class, "user_id");
    }
    public function MatrixPayments()
    {
        return $this->hasMany(Contribution::class, "user_id")->with("contributionTier");
    }
    public function userSubscriptionLinks()
    {
        return $this->hasMany(UserSubscriptionLink::class, "user_id");
    }
    public function userEarnings()
    {
        return $this->hasMany(TierEarning::classuserEarnings);
    }
    public function userAccount()
    {
        return $this->hasOne(ContributorAccount::class);
    }
    public function bonusPayment()
    {
        return $this->hasOne(BonusPayment::class);
    }
    public function companyReceivedPayment()
    {
        return $this->hasOne(CompanyReceivedPayment::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class, "order_owner_id");
    }
    public function userOneTimeInviteLinks(){
        return $this->hasMany(UserIniviteOneTimeLink::class,"user_id");
    }

}
