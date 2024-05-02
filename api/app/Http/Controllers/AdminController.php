<?php

namespace App\Http\Controllers;

use App\Mail\SendAccesorInviteMail;
use App\Mail\sendReportApprovalMail;
use App\Models\BonusPayment;
use App\Models\Category;
use App\Models\CompanyReceivedPayment;
use App\Models\Contribution;
use App\Models\ContributionPayback;
use App\Models\MasterPayment;
use App\Models\MatrixOption;
use App\Models\OrderProduct;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Supplier;
use App\Models\SystemSetting;
use App\Models\TierEarning;
use App\Models\User;
use App\Models\UserIniviteOneTimeLink;
use App\Services\ContributionService;
use App\Services\SubscriptionLinksService;
use App\Services\SupplierService;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Mail;
use Mockery\Exception;
use Validator;

class AdminController extends Controller
{
    //
    protected $supplierservice;

    protected $subscriptionlinkservice;
    protected $contributionservice;

    public function __construct(SupplierService $supplierservice, SubscriptionLinksService $subscriptionlinkservice,ContributionService $contributionservice)
    {
        $this->supplierservice = $supplierservice;
        $this->subscriptionlinkservice = $subscriptionlinkservice;
        $this->contributionservice=$contributionservice;
        $this->middleware('auth:api')->except(['download','syncsponsorship']);
        $this->middleware('Admin')->except(['getAllRoles', 'download']);
    }
    public function syncsponsorship(){
        User::cursor()->each(function ($user) {          
            $objecttosave['user_id'] = $user->id;
            $objecttosave['is_sponsorship'] = 1;    
          
            if(!UserIniviteOneTimeLink::where($objecttosave)->exists()){
                $objecttosave['invite_token'] = $this->generateOneTimeInviteToken($user);
                UserIniviteOneTimeLink::create($objecttosave);
            }
           
        });
        
    }
 
    public function getSponsorshipLinks(){

      $sponsors= Contribution::with(['user'])->where("tier_id",2)
        ->join("users","users.id","contributions.user_id")
        ->paginate(10);
        return $sponsors;
        
    }
    public function getUsers()
    {
        $users = User::with('Invites')->with('payments')->with('MatrixPayments')->with('userSubscriptionLinks')->get();

        return response()->json($users, 200);
    }
    public function activateDeactivateUser(Request $request)
    {
        $user = auth()->user();
        if (auth()) {
            if ($request->action == 'activate') {
                $usertoupdate = User::where('id', $request->user)->first();
                $usertoupdate->status = 1;
                $usertoupdate->save();

                return response()->json(['message' => 'Account activated'], 201);
            } elseif ($request->action == 'deactivate') {
                $usertoupdate = User::where('id', $request->user)->first();
                $usertoupdate->status = 0;
                $usertoupdate->save();

                return response()->json(['message' => 'Account deactivated'], 201);
            }
        } else {
            return response()->json(['message' => 'You are unaunthenticated.Please login to continue'], 401);
        }
    }

    public function getDashboard(Request $request)
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $thismonthsusers = User::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)->count();
        $thisyearsusers = User::whereYear('created_at', $currentYear)->count();
        $startDate = Carbon::now()->startOfWeek(); // Start of the current week
        $endDate = Carbon::now()->endOfWeek(); // End of the current week
        $usersThisWeek = User::whereBetween('created_at', [$startDate, $endDate])->count();
        //company payments
        $totalcompanyPayments = CompanyReceivedPayment::sum('amount_paid');
        //company payments
        //company payments
        $totalMatrix = Contribution::sum('contribution_amount');
        //company payments
        // payments
        $totalPayments = MasterPayment::sum('amount_paid');

        // payments
        return response()->json([
            'message' => 'Loaded',
            'thismonthusers' => $thismonthsusers,
            'thisweeksusers' => $usersThisWeek,
            'thisyearsusers' => $thisyearsusers,
            'totalcompanyPayments' => $totalcompanyPayments,
            'payments' => $totalMatrix,
            'totalpayments' => $totalPayments,
        ], 200);
    }

    public function deleteRole($id)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'add role')->first())) {
            try {
                DB::beginTransaction();
                $role = Role::findOrFail($id);
                $rolede = Role::where('id', $id)->first();
                $rolede->permissions()->detach();
                $role->permissions()->detach();
                $role->delete();
                DB::commit();

                return response()->json([
                    'message' => 'Deleted successfully.',
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"

                return response()->json([
                    'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                    'error' => $exception,
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function updateRole(Request $request, $id)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'add role')->first())) {
            try {
                DB::beginTransaction();

                $roleup['name'] = $request->role_name;
                $roleup['slug'] = strtolower($request->role_name);
                $roleup['status'] = 1;

                $role = Role::findOrFail($id);
                $role->fill($roleup);
                $role->save();
                DB::commit();

                return response()->json([
                    'message' => 'Updated successfully.',
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"

                return response()->json([
                    'message' => 'Failed.' . $exception->getMessage() . '.Please contact admin.',
                    'error' => $exception,
                    'payload' => $request->all(),
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function addRoles(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'add role')->first())) {
            try {
                DB::beginTransaction();
                $roles = json_decode(stripslashes($request->post('role_name')), true);
                foreach ($roles as $role) {
                    $role['name'] = $request->post('role_name');
                    $role['slug'] = strtolower($request->post('role_name'));
                    $role['status'] = 1;
                    Role::create($role);
                }
                DB::commit();

                return response()->json([
                    'message' => 'Added successfully.',
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"

                return response()->json([
                    'message' => 'Failed.Please contact admin.',
                    'error' => $exception,
                ], 400);
            } finally {
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function addPermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'add permission')->first())) {
            $validator = Validator::make($request->all(), [
                'permission_name' => 'required|unique:permissions,name',
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => 'Unprocessable data', 'errors' => $validator->errors()], 422);
            }
            try {
                DB::beginTransaction();
                // $permissions = json_decode(stripslashes($request->post('permission_name')), true);
                // foreach ($permissions as $perm) {
                //     //check if exists
                // $found = Permission::where("name", )->get();
                // if (sizeof($found) == 0) {
                $permission['name'] = $request->permission_name;
                $permission['slug'] = strtolower($request->permission_name);
                $permission['status'] = 1;
                Permission::create($permission);
                // }
                //check if exists

                // }
                DB::commit();

                return response()->json([
                    'message' => 'Added successfully',
                ], 201);
            } catch (\Exception $exception) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"

                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exception->getMessage(),
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function getAllPermissions()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'assign role permission')->first())) {
            return response()->json(Permission::orderBy('name', 'ASC')->get(), 201);
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function getAllRoles()
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'view roles')->first())) {

            $roles = Role::with('permissions')->get();

            return response()->json($roles, 201);
        } elseif ($user->hasPermissionTo(Permission::where('slug', 'view valuation firm roles')->first())) {

            $roles = Role::with('permissions')->where('name', 'LIKE', '%uploader%')->get();

            return response()->json($roles, 201);
        } elseif ($user->hasPermissionTo(Permission::where('slug', 'view accesor firm roles')->first())) {

            $roles = Role::with('permissions')->where('name', 'LIKE', '%accessor%')->get();

            return response()->json($roles, 201);
        } else {

            return response()->json(['message' => 'Permission Denied'], 401);
        }
    }

    public function assignRolePermissions(Request $request)
    {
        $user = auth()->user();
        if ($user->hasPermissionTo(Permission::where('slug', 'assign role permission')->first())) {
            try {
                DB::beginTransaction();
                $data = $request->post('permissions');
                //  get role details
                $role = Role::where('id', $request->post('role'))->first();
                $role->permissions()->detach();
                $permissions = $request->post('permissions');
                foreach ($permissions as $permission) {
                    $axist = DB::table('roles_permissions')->where('permission_id', $permission)->where('role_id', $request->post('role'))->get();
                    // if(sizeof($axist)==0){
                    $perm = Permission::where('id', $permission)->first();
                    $role->permissions()->attach($perm);
                    // }

                }
                DB::commit();

                return response()->json([
                    'message' => 'Assigned successfully',
                    'permissions' => $role->permissions()->get(),
                ], 201);
                //  get role details
            } catch (\Exception $exp) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"

                return response()->json([
                    'message' => 'Failed.',
                    'error' => $exp->getMessage(),
                ], 400);
            }
        } else {
            return response()->json(['message' => 'Permission Denie'], 401);
        }
    }

    public function getRolePermissions(Request $request)
    {
        $roleperms = DB::table('roles_permissions')
            ->join('roles', 'roles.id', '=', 'roles_permissions.role_id')
            ->join('permissions', 'permissions.id', '=', 'roles_permissions.permission_id')
            ->select('roles.name as role_name', 'permissions.name as permission_name', 'roles_permissions.*')->get();

        // $role = Role::where("id", $request->get('role'))->first();
        return response()->json($roleperms, 200);
    }

    public function generateInviteToken($request)
    {
        $token = Str::random(80);
        $this->storeToken($token, $request);

        return $token;
    }

    public function storeToken($token, $request)
    {
        DB::table('valuation_firm_invites')->insert([
            'valauaion_firm_name' => $request['company_name'],
            'invite_phone' => $request['invite_phone'],
            'isk_number' => $request['isk_number'],
            'vrb_number' => $request['vrb_number'],
            'director_name' => $request['directors_name'],
            'invite_email' => $request['email'],
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'created_at' => Carbon::now(),
        ]);
    }
    //send accesor invite

    public function sendAccesorInviteEMail($request)
    {

        $token = $this->generateAccesorInviteToken($request);
        Mail::to($request['email'])->send(new SendAccesorInviteMail($token, $request['registration_url'], $request['login_url']));
    }

    public function generateAccesorInviteToken($request)
    {
        $token = Str::random(80);
        $this->storeAccesorToken($token, $request);

        return $token;
    }

    public function storeAccesorToken($token, $request)
    {
        DB::table('accesor_invites')->insert([
            'accessor_name' => $request['accesor_name'],
            'contact_person_phone' => $request['contact_person_phone'],
            'contact_person_name' => $request['contact_person_name'],
            'invite_email' => $request['email'],
            'registration_url' => $request['registration_url'],
            'login_url' => $request['login_url'],
            'invite_token' => $token,
            'created_at' => Carbon::now(),
        ]);
    }
    //close send accesor invite
    //  close accesor requests

    public function payments(Request $request)
    {
        // $payments = MasterPayment::with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->with('User')->get("*");
        $payments = MasterPayment::with('Bonuses', 'CompanyPayments', 'MatrixPayments', 'User');
        // $payments->join("users", "users.id", "=", "master_payments.user_id");

        if ($request->filled("search")) {
            $payments->whereHas('User', function ($query) use ($request) {
                $query->where('full_name', 'like', "%{$request->search}%");
            });
        }

        $pays = $payments->paginate($request->no_records);
        return response()->json(['message' => 'loaded', 'data' => $pays], 200);
    }
    public function bonusPayments(Request $request)
    {
        // $payments = MasterPayment::with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->with('User')->get("*");
        $payments = BonusPayment::with("payer")->paginate(10);
        return response()->json(['message' => 'loaded', 'data' => $payments], 200);
    }
    public function companyPayments(Request $request)
    {
        $payments = CompanyReceivedPayment::with("payer")->get();
        return response()->json(['message' => 'loaded', 'data' => $payments], 200);
    }
    public function verifyPayment(Request $request)
    {
       $reposnse= $this->contributionservice->verifyPayment($request); 
       return $reposnse;
    }

    public function autoVerifyPayment($payment, $action)
    {
        try {

            DB::beginTransaction();
            $response = '';
            // $payment_arr = json_decode($payment, true);
            $masterPaymentid = $payment->id;
            $contributions = Contribution::where('payment_id', $masterPaymentid)->get();
            $bonuses = BonusPayment::where('payment_id', $masterPaymentid)->get();
            $masterpay = MasterPayment::findOrFail($masterPaymentid);
            if ($masterpay) {
                $masterpay->status = ($action == 1) ? 'APPROVED' : 'REJECTED';
                $masterpay->save();
                if (($action == 1) && $masterpay->save()) {
                    //close update contributions
                    //update bonuses
                    BonusPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update bonuses
                    //update company payments
                    CompanyReceivedPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update company payments
                    //update contributions
                    Contribution::where('payment_id', $masterPaymentid)->update(['admin_approved' => 'Approved']);
                    foreach ($contributions as $contribution) {
                        $contributiontoup = Contribution::findOrFail($contribution['id']);
                        $contributiontoup->admin_approved = 'Approved';
                        if ($contributiontoup) {
                            $response = $this->progressToNextTier($contributiontoup);
                        }
                    }
                } else {
                }
                DB::commit();
            } else {
            }

            return response()->json(['message' => $response, 'data' => $masterPaymentid], 201);
        } catch (Exception $ex) {
            DB::rollBack();

            return response()->json(['message' => 'Verification failed.Please contact Admin.' . $ex->getMessage()], 400);
        }
    }

    public function progressToNextTier($contribution, $action = 1)
    {
        //assign payment
        $thistier = MatrixOption::where('id', $contribution->tier_id)->first();
        $assignment_ = $this->assignContributionToAnInvestor($thistier, $contribution->user_id);
        $reposnse = [];
        $reposnse_thisuser = [];

        if ($assignment_) {
            $contributiontoupp = Contribution::findOrFail($contribution->id);
            ///assign payment
            //check the received payments
            $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);

            //get contribution tier details
            $contribution_tier = MatrixOption::where('id', $contribution->tier_id)->first();
            array_push(
                $reposnse_thisuser,
                [
                    'Completed Paybacks by this user' => $no_of_completed_paybacks,
                    'Expected minimum Progression' => $contribution_tier->minimum_progression_amount,
                    'List of back payments for this user ' => $no_of_completed_paybacks
                ]
            );


            if ($no_of_completed_paybacks > 0) {

                array_push(
                    $reposnse_thisuser,
                    [
                        'if condition 1' => (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                        'else  if 2' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                        'else if 3' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1))

                    ]
                );

                if (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                    //progress to nex level
                    $reposnse = $reposnse . 'progressed but receiving';
                    $contributiontoupp->status = 'Progressed But Receiving';
                    $contributiontoupp->save();
                    $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);

                    $updatethisusereligibility = $this->updateEligibility($contribution->user_id, $nexttier->id, $contribution_tier->id);

                    //migrate the payee incase its not the company and not
                } elseif (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                    //progress to nex level
                    $contributiontoupp->status = 'Progressed But Receiving';
                    $contributiontoupp->save();
                    //migrate the payee incase its not the company and not
                } elseif (($no_of_completed_paybacks >= $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1)) {
                    $contributiontoupp->status = 'Completed';
                    $contributiontoupp->save();
                    $counts = ContributionPayback::where('contribution_id_reciving_payback', $contribution->id)->count();
                    ///get payback totals
                    $tierearning['user_id'] = $contribution->user_id;
                    $tierearning['tier_id'] = $contribution->tier_id;
                    $tierearning['total_earnings_so_far'] = $counts * ($contribution->contribution_amount);
                    $tierearning['subscription_used_amount'] = 0;
                    $tierearning['withdraw_amount'] = 0;
                    $tierearning['status'] = 0;
                    $createdearning = TierEarning::create($tierearning);
                    if ($createdearning) {
                        $user = User::findOrFail($contribution->user_id);
                        $user->eligible_tier = 0;
                        $user->eligibility_for_elible = 0;
                        $user->save();

                        return 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' are the earnings.';
                    } else {
                        return 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' failed to be processed.Please contact Admin';
                    }
                    ///move earnings to earnings table
                }
            } elseif ($no_of_completed_paybacks == 0) {

                //migrate the payee incase its not the company and not

                //close migrate the payee incase its not the company and not
            }

            $backpaiduser = $this->getBackPaidUserBasedOnContributionObject($contribution);
            array_push(
                $reposnse_thisuser,
                [
                    'Backpaid User contribution details check ' => $backpaiduser
                ]
            );
            if ($backpaiduser['count'] > 0) {
                $backpaidcontribution = Contribution::where('id', $backpaiduser['backpaiduser']->contribution_id_reciving_payback)->with('user')->first();
                array_push(
                    $reposnse_thisuser,
                    [
                        'Backpaid User contribution details check ' => $backpaiduser,
                        'Has the backpaid users payment approved' => $this->checkIfUserHasPaidForTierandItsApproved($contribution_tier->id, $backpaiduser['backpaiduser']->payee_user_id)
                    ]
                );
                $haspaid = $this->checkIfUserHasPaidForTierandItsApproved($contribution_tier->id, $backpaiduser['backpaiduser']->payee_user_id);
                if ($haspaid == 1) {
                    $reposnseee = $this->progressBackPiadUserToNextTier($backpaidcontribution, 1);
                    array_push(
                        $reposnse_thisuser,
                        ['Progressbackpaiduserresponse' => $reposnseee]
                    );
                    // $reposnse = $reposnse . 'Payment status' . $haspaid . 'Backpaiduserresponse -' . $reposnseee;
                } else {
                    // $reposnse = $reposnse . 'Payment status' . $haspaid . 'Backpaiduser - Found but has not paid' . json_encode($backpaiduser) . 'contritier ' . $contribution_tier->id . 'user cont' . $backpaiduser['backpaiduser']->payee_user_id;
                }
            } else {
                // $reposnse = $reposnse . 'Backpaiduser - Not found. 4' . json_encode($backpaiduser);
            }

            return $reposnse_thisuser;
        }
    }

    public function progressBackPiadUserToNextTier($contribution, $action = 1)
    {
        //assign payment
        $thistier = MatrixOption::where('id', $contribution->tier_id)->first();
        ///assign payment
        //check the received payments
        $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);
        //get contribution tier details
        $contribution_tier = MatrixOption::where('id', $contribution->tier_id)->first();
        $contributiontoupp = Contribution::findOrFail($contribution->id);
        $reposnse_thisuser = [];
        array_push(
            $reposnse_thisuser,
            [
                'Completed Paybacks by this user' => $no_of_completed_paybacks,
                'Expected minimum Progression' => $contribution_tier->minimum_progression_amount,
                'List of back payments for this user ' => $no_of_completed_paybacks
            ]
        );
        if ($no_of_completed_paybacks > 0) {
            array_push(
                $reposnse_thisuser,
                [
                    'if condition 1' => (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                    'else  if 2' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                    'else if 3' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1))
                ]
            );
            if (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level

                $contributiontoupp->status = 'Progressed But Receiving';
                $contributiontoupp->save();
                $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);

                $updatethisusereligibility = $this->updateEligibilityForBack($contribution->user_id, $nexttier->id, $contribution_tier->id);
                // $reposnse = $reposnse . 'Backpaiduser Update eligibility ' . $updatethisusereligibility;
                //close migrate the payee incase its not the company and not
                ///progress to next level
                //paid contributor process

                ///paid contributor process
            } elseif (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level
                $contributiontoupp->status = 'Progressed But Receiving';
                $contributiontoupp->save();

                // $reposnse = $reposnse . 'BPU Progressed But Receiving';
            } elseif (($no_of_completed_paybacks < $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level
                // $reposnse = $reposnse . 'BPU not qualified for any action.';
            } elseif (($no_of_completed_paybacks >= $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1)) {
                $contributiontoupp->status = 'Completed';
                $contributiontoupp->save();
                $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);
                if ($nexttier != null) {
                    $updatethisusereligibility = $this->updateEligibilityForBack($contribution->user_id, $nexttier->id, $contribution_tier->id);
                    array_push(
                        $reposnse_thisuser,
                        [
                            'next tier' => $nexttier,
                            'Update eligibility response' => $updatethisusereligibility
                        ]
                    );
                    //migrate the payee incase its not the company and not
                    //get payback totals
                    $counts = ContributionPayback::where('contribution_id_reciving_payback', $contribution->id)->count();
                    ///get payback totals
                    $tierearning['user_id'] = $contribution->user_id;
                    $tierearning['tier_id'] = $contribution->tier_id;
                    $tierearning['total_earnings_so_far'] = $counts * ($contribution->contribution_amount);
                    $tierearning['subscription_used_amount'] = 0;
                    $tierearning['withdraw_amount'] = 0;
                    $tierearning['status'] = 0;
                    $createdearning = TierEarning::create($tierearning);
                    if ($createdearning) {
                        $user = User::findOrFail($contribution->user_id);
                        $user->eligible_tier = 0;
                        $user->eligibility_for_elible = 0;
                        $user->save();
                        // $reposnse = $reposnse . 'BPU has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' are the earnings.';
                    } else {
                        // $reposnse = $reposnse . 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' failed to be processed.Please contact Admin';
                    }
                } else {
                    $savepayment['user_id'] = $contribution->user_id;
                    $savepayment['description'] = 'Auto payment of exiting Platform';
                    $savepayment['payment_proof'] = 'Auto by Admin';
                    $savepayment['status'] = "APPROVED";
                    $savepayment['amount_paid'] = 50;
                    $masterpayment = MasterPayment::create($savepayment);
                    $companypaymentob['amount_paid'] = 50;
                    $companypaymentob['paid_by'] = $contribution->user_id;
                    $companypaymentob['paid_as'] = 'Exit from platform';
                    $companypaymentob['payment_id'] = $masterpayment->id;
                    $companypayment = CompanyReceivedPayment::create($companypaymentob);
                }

                ///move earnings to earnings table

            }
        } else {
        }

        return $reposnse_thisuser;
    }

    public function distributeTierEarningsBalances()
    {
    }

    public function getPotentialPayee($contribution_tier)
    {
        $potential_payee = Contribution::where('tier_id', $contribution_tier->id)
            ->where('admin_approved', 'Approved')
            ->where(function ($innerQuery) {
                $innerQuery->where('status', 'Not Progressed but Receiving')
                    ->orWhere('status', 'Progressed But Receiving');
            })
            ->orderBy('id', 'desc')
            ->first();

        return $potential_payee;
    }

    public function checkIfUserMeetsEligibility($current_tier_id, $user)
    {
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();
        $contribution = Contribution::where('user_id', $user)->where('tier_id', $current_tier_id)->first();
        $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);
        $approved_contribution_for_current_tier_user = Contribution::where('user_id', $user)->where('tier_id', $current_tier_id)->where('admin_approved', 'APPROVED')->count();
        if (($no_of_completed_paybacks >= $current_tier->minimum_progression_count) && $approved_contribution_for_current_tier_user == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function assignContributionToAnInvestor($tierobject_to_assign, $user_contributing)
    {
        //get oldest user in this tier liable to a payment
        $oldestnonpaidcontributioninthistier = Contribution::where('tier_id', $tierobject_to_assign->id)->where('payback_count', '<', $tierobject_to_assign->payback_count)->whereNotIn('user_id', [$user_contributing])->orderBy('id', 'ASC')->first();
        $oldestnonpaidcontributioninthistiercount = Contribution::where('tier_id', $tierobject_to_assign->id)->where('payback_count', '<', $tierobject_to_assign->payback_count)->whereNotIn('user_id', [$user_contributing])->where('admin_approved', 'Approved')->orderBy('id', 'ASC')->count();
        ////get oldest user in this tier liable to a payment
        if ($oldestnonpaidcontributioninthistiercount > 0) {
            //assign the contribution to available investor
            //step one - update count and amount
            $payerscontribution = Contribution::where('user_id', $user_contributing)->where('tier_id', $tierobject_to_assign->id)->first();
            $payesscontribution = Contribution::findOrFail($oldestnonpaidcontributioninthistier->id);
            $payesscontribution->payback_paid_total + $payerscontribution->contribution_amount;

            $payesscontribution->payback_count++; // Increment the payback_count by 1
            $payesscontribution->payback_paid_total += $payerscontribution->contribution_amount; // Increment the payback_paid_total by the contribution_amount
            $payesscontribution->save();
            ///step one - update count and amount
            // step two - do entry to paybacks
            $paybabckentry['contribution_id_reciving_payback'] = $payesscontribution->id;
            $paybabckentry['contribution_id_paying_payback'] = $payerscontribution->id;
            $paybabckentry['payment_status'] = 'Verified';
            $paybackentry = ContributionPayback::create($paybabckentry);
            /// step two - do entry to paybacks
            $userpaid = User::where('id', $payesscontribution->user_id)->first();
            if ($payesscontribution && $paybackentry) {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment has been linked to an investor (' . $userpaid->full_name . ') successfully ' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            } else {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment failed to be linked to an investor successfully.PLease alert an Admin' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            }

            //assign the contribution to available investor
        } else {
            //assign the contribution to company
            $payerscontribution = Contribution::where('user_id', $user_contributing)->where('tier_id', $tierobject_to_assign->id)->first();

            $companypaymentbob['amount_paid'] = $payerscontribution->contribution_amount;
            $companypaymentbob['paid_by'] = $user_contributing;
            $companypaymentbob['paid_as'] = 'Matrix payment for  ' . $tierobject_to_assign->club . ' ' . $tierobject_to_assign->tier_name;
            $companypaymentbob['payment_method'] = 'Unspecified';
            $companypaymentbob['status'] = 'Approved';
            $companypaymentbob['payment_id'] = $payerscontribution->payment_id;
            $companypayment = CompanyReceivedPayment::create($companypaymentbob);
            if ($companypayment) {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment has been linked to the elevate company successfully' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            } else {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment failed to be linked to elevate company successfully.PLease alert an Admin' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            }
            ///close assign the contribution to company
        }
    }

    public function updateEligibility($user, $nexttier_id, $current_tier_id)
    {
        $message = '';
        $nexttier = MatrixOption::where('id', $nexttier_id)->first();
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();

        if ($this->checkIfUserMeetsEligibility($current_tier_id, $user)) {
            //register subscription
            //save payment
            $savepayment['user_id'] = $user;
            $savepayment['description'] = 'Auto payment of moving to next tier of ' . $nexttier->contribution_amount;
            $savepayment['payment_proof'] = 'Auto by Admin';
            $savepayment['status'] = "PENDING ADMIN APPROVAL";
            $savepayment['amount_paid'] = $nexttier->contribution_amount;
            $masterpayment = MasterPayment::create($savepayment);
            //save payment
            //send to company account
            if ($current_tier->minimum_progression_count == 27) {
                $companypaymentob['amount_paid'] = 5;
                $companypaymentob['paid_by'] = $user;
                $companypaymentob['paid_as'] = 'Exit from platform';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                // $message="The user has been exited from the platform successfully.";
            } else {

                $matrixcontribution['user_id'] = $user;
                $matrixcontribution['tier_id'] = $nexttier->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['payback_count'] = 0;
                // $matrixcontribution['admin_approved']="Approved";
                $matrixcontribution['contribution_amount'] = $nexttier->contribution_amount;
                $matrixcontribution['payment_id'] = $masterpayment->id;
                $contribution = Contribution::create($matrixcontribution);
                //auto approve Pay
                $thismatser = MasterPayment::where("id", $masterpayment->id)->with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->first();

                $this->autoVerifyPayment($thismatser, 1);
                //auto approve Pay
            }
            //send to company account
            //send to matrix
            ///close registering subscription
            //upgrade
            $thiscontributinguser = User::where('id', $user)->first();
            if ($thiscontributinguser->eligible_tier === $current_tier) {
                $thiscontributinguser->eligible_tier = $nexttier;

                return $message;
            } else {
                return 'failed';
            }
            ///close upgrade
        } else {
            return 'Failed to upgrade because the user does not meet the minimum required conditions.';
        }
    }

    public function updateEligibilityForBack($user, $nexttier_id, $current_tier_id)
    {
        $message = '';
        $nexttier = MatrixOption::where('id', $nexttier_id)->first();
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();
        $response = [];
        array_push($response, [
            'Eligibility check' => $this->checkIfUserMeetsEligibility($current_tier_id, $user)
        ]);
        if ($this->checkIfUserMeetsEligibility($current_tier_id, $user)) {
            //register subscription
            //save payment
            $savepayment['user_id'] = $user;
            $savepayment['description'] = 'Auto payment of moving to next tier of ' . $nexttier->contribution_amount;
            $savepayment['payment_proof'] = 'Auto by Admin';
            $savepayment['status'] = "PENDING ADMIN APPROVAL";
            $savepayment['amount_paid'] = $nexttier->contribution_amount;
            $masterpayment = MasterPayment::create($savepayment);
            //save payment
            //send to company account
            if ($current_tier->minimum_progression_count == 27) {
                $companypaymentob['amount_paid'] = 5;
                $companypaymentob['paid_by'] = $user;
                $companypaymentob['paid_as'] = 'Exit from platform';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                // $message="The user has been exited from the platform successfully.";
            } else {

                $matrixcontribution['user_id'] = $user;
                $matrixcontribution['tier_id'] = $nexttier->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['payback_count'] = 0;
                // $matrixcontribution['admin_approved']="Approved";
                $matrixcontribution['contribution_amount'] = $nexttier->contribution_amount;
                $matrixcontribution['payment_id'] = $masterpayment->id;

                array_push($response, [
                    'Passed to upgrade to next tier option 2' => $nexttier->id,
                    'newcontribution' => $matrixcontribution
                ]);
                $contribution = Contribution::create($matrixcontribution);
                //auto approve Pay
                $thismatser = MasterPayment::where("id", $masterpayment->id)->with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->first();

                $this->autoVerifyPayment($thismatser, 1);
                //auto approve Pay
            }
            //send to company account
            //send to matrix
            ///close registering subscription
            //upgrade
            $thiscontributinguser = User::where('id', $user)->first();
            if ($thiscontributinguser->eligible_tier === $current_tier) {
                $thiscontributinguser->eligible_tier = $nexttier;

                array_push($response, [
                    'Users t eligibility updated' => true,
                    'newcontribution' => $thiscontributinguser
                ]);
            } else {
                array_push($response, [
                    'Users t eligibility updated' => false,
                    'newcontribution' => $thiscontributinguser
                ]);
            }
            ///close upgrade
        } else {
        }
        return $response;
    }

    public function getNextClubAndTierByContriObject($currenttier)
    {

        if ($currenttier->club == 1) {
            if ($currenttier->tier_name == 'Tier 1') {
                $contribution_tier = MatrixOption::where('tier_name', 'Tier 2')->first();

                return $contribution_tier;
            } elseif ($currenttier->tier_name == 'Tier 2') {
                $contribution_tier = MatrixOption::where('tier_name', 'Tier 3')->first();

                return $contribution_tier;
            } elseif ($currenttier->tier_name == 'Tier 3') {
                $contribution_tier = MatrixOption::where('tier_name', 'Tier 4')->first();

                return $contribution_tier;
            }
        }
    }

    public function getPayBacksCountByConributionObject($contribution)
    {
        $contributionpayback = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')
            ->join('master_payments', 'master_payments.id', '=', 'contributions.payment_id')
            ->where('master_payments.status', 'APPROVED')
            ->where('contribution_paybacks.contribution_id_paying_payback', $contribution['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id')->count();

        return $contributionpayback;
    }

    public function getMyPayBacksCountByConributionObject($contribution)
    {
        $contributionpayback = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')
            ->join('master_payments', 'master_payments.id', '=', 'contributions.payment_id')
            ->where('master_payments.status', 'APPROVED')
            ->where('contribution_paybacks.contribution_id_reciving_payback', $contribution['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id')->count();

        return $contributionpayback;
    }

    public function checkUserTierApproval(Request $request)
    {
        return $this->checkIfUserHasPaidForTierandItsApproved($request->tier, $request->user);
    }

    public function checkIfUserHasPaidForTierandItsApproved($tier_id, $user_id)
    {
        $contributionpayback = Contribution::join('master_payments', 'master_payments.id', '=', 'contributions.payment_id');
        $contributionpayback->where('contributions.user_id', $user_id);
        $contributionpayback->where('contributions.tier_id', $tier_id);
        $contributionpayback->where('master_payments.status', 'APPROVED');
        $recordsfound = $contributionpayback->count();
        if ($recordsfound > 0) {
            return 1;
        }

        return 0;
    }

    public function getBackPaidUserBasedOnContributionObject($contributionobject)
    {
        $contributionpaybackq = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')

            ->where('contribution_paybacks.contribution_id_paying_payback', $contributionobject['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id');

        return ['count' => $contributionpaybackq->count(), 'backpaiduser' => $contributionpaybackq->first(), 'contributionobjectid' => $contributionobject['id']];
    }

    public function addSupplier(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required|max:255',
            'supplier_email' => 'required|email|unique:suppliers',
            'supplier_phone' => 'required|unique:suppliers|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $record = $this->supplierservice->saveSupplier($request, 'add');

            return $record;
        }
    }

    public function updateSupplier(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required|max:255',
            'supplier_email' => 'required|email',
            'supplier_phone' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $record = $this->supplierservice->saveSupplier($request, 'update');

            return $record;
        }
    }

    public function addSupplierProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|max:255',
            'category' => 'required',
            'sku_name' => 'required',
            'quantity_available' => 'required|max:255',
            'price' => 'required',
            'currency' => 'required',
            'quantity_cap' => 'required|max:255',
            'about_product' => 'required',
            'supplier' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $record = $this->supplierservice->saveSupplierProduct($request, 'add');

            return $record;
        }
    }

    public function updateSupplierProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|max:255',
            'category' => 'required',
            'sku_name' => 'required',
            'quantity_available' => 'required|max:255',
            'price' => 'required',
            'currency' => 'required',
            'quantity_cap' => 'required|max:255',
            'about_product' => 'required',
            'supplier' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $record = $this->supplierservice->saveSupplierProduct($request, 'update');

            return $record;
        }
    }
    public function deleteSupplierProduct(Request $request)
    {
        $response = $this->supplierservice->deleteSupplierProduct($request);
        return $response;
    }

    public function getAllSuppliers()
    {
        $suppliers = Supplier::with('supplierProduct')->get();

        return $suppliers;
    }

    //categories
    public function addCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            try {
                DB::beginTransaction();
                $category = Category::create(['category_name' => $request->category_name]);
                DB::commit();

                return response()->json(['message' => 'Saved successfully', 'created_supplier' => $category], 200);
            } catch (Exception $ex) {
                DB::rollBack();

                return response()->json(['message' => 'Failed.Please contact Admin. ' . $ex->getMessage(), 'data' => $request->all()], 400);
            }
        }
    }

    public function updateCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            try {
                DB::beginTransaction();
                $categoryup = Category::findOrFail($request->category);
                $categoryup->update(['category_name' => $request->category_name]);
                $category = Category::where('id', $request->category)->first();
                DB::commit();

                return response()->json(['message' => 'Updated successfully', 'updated_category' => $category], 200);
            } catch (Exception $ex) {
                DB::rollBack();

                return response()->json(['message' => 'Failed.Please contact Admin. ' . $ex->getMessage(), 'data' => $request->all()], 400);
            }
        }
    }

    //categories
    ///subscription links
    public function addSubscriptionLinks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subscription_link' => 'required|url|unique:subscription_links,link',
            'monthly_subscription' => 'required|numeric',
            'annual_subscription' => 'required|numeric',
            'sponsoring_organization' => 'required',
            'description' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $result = $this->subscriptionlinkservice->saveLink($request, 'add');

            return $result;
        }
    }

    public function updateSubscriptionLinks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subscription_link' => 'required|url',
            'monthly_subscription' => 'required|numeric',
            'annual_subscription' => 'required|numeric',
            'sponsoring_organization' => 'required',
            'description' => 'required',
            'link' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            $result = $this->subscriptionlinkservice->saveLink($request, 'update');

            return $result;
        }
    }

    ///subscription links
    public function getTierContributionDetails(Request $request)
    {
        $contribution = Contribution::where('tier_id', $request->tier)->with('contributionTier')->with('user')->get();

        return $contribution;
    }

    public function generateUserOneTimeInviteForUsers(Request $request)
    {
        $allusers = User::all();
        foreach ($allusers as $user) {
            $objecttosave['user_id'] = $user->id;
            $objecttosave['invite_token'] = $this->generateOneTimeInviteToken($user);
            UserIniviteOneTimeLink::create($objecttosave);
        }

        return true;
    }
    public function generateOneTimeInviteToken($user)
    {
        $randostring = "";
        do {
            $randostring = Str::random(6);
        } while (UserIniviteOneTimeLink::where("invite_token", "=", $randostring)->first());
        return $randostring;
    }

    public function getUserLinkInvitees(Request $request)
    {
        $sublink = $request->sublink;
        $contribution = Contribution::where('tier_id', $request->tier)->where('user_id', $request->user)->first();
        return $contribution;
    }
    public function saveWalletID(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|max:255',
            'wallet' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            try {
                DB::beginTransaction();
                $saveobject['payment_method'] = $request->method;
                $saveobject['wallet_id'] = $request->wallet;
                $created = SystemSetting::create($saveobject);
                DB::commit();
                return response()->json(['data' => [], 'message' => 'Wallet saved successsfully', 'success' => true], 200);
            } catch (Exception $exp) {

                return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
                DB::rollback();
            }
        }
    }
    public function getTierEarnings(Request $request)
    {
        $all = TierEarning::with("user")->with("tier")->get();
        return $all;
    }
    public function payMember(Request $request)
    {
        try {
            DB::beginTransaction();
            $toupdate = TierEarning::findOrFail($request->earning);
            $toupdate->update(['status' => 1, 'used_payment_method' => $request->method, 'used_wallet' => $request->wallet]);
            DB::commit();
            return response()->json(['data' => [], 'message' => 'Payment Done', 'success' => true], 200);
        } catch (Exception $exp) {
            DB::rollback();
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }
    }
    public function payMemberBonus(Request $request)
    {
        try {
            DB::beginTransaction();
            $toupdate = BonusPayment::findOrFail($request->earning);
            $toupdate->update(['payment_status' => 1, 'used_payment_method' => $request->method, 'used_wallet' => $request->wallet_id]);
            DB::commit();
            return response()->json(['data' => [], 'message' => 'Bonus Payment Done', 'success' => true], 200);
        } catch (Exception $exp) {
            DB::rollback();
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }
    }
    public function download(Request $request)
    {
        try {
            $myFile = public_path("proofs/" . $request->file . "");
            return response()->download($myFile);
        } catch (Exception $exp) {
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }
    }
    public function updateOrderProductStatus(Request $request)
    {
        try {
            DB::beginTransaction();
            $toupdate = OrderProduct::findOrFail($request->op);
            $toupdate->update(['payment_status' => $request->payment, 'delivery_status' => $request->delivery]);
            DB::commit();
            return response()->json(['data' => [], 'message' => 'Order Product Updated successfully', 'success' => true], 200);
        } catch (Exception $exp) {
            DB::rollback();
            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
        }
    }
}
