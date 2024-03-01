<?php
namespace App\Http\Controllers;

use App\Mail\SendContributorInviteMail;
use App\Mail\SendPasswordResetMail;
use App\Models\ContributorAccount;
use App\Models\PasswordReset;
use App\Models\Role;
use App\Models\SystemPaymentDetail;
use App\Models\SystemUserInvite;
use App\Models\User;
use App\Models\UserIniviteOneTimeLink;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Mail;
use Mockery\Exception;
use Validator;

class AuthController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', [
            'except' => [
                'inviteContributor',
                'login',
                'register',
                'SendAccountPasswordResetLink',
                'verifyResetToken',
                'retrieveInviteDetails',
                'retrieveOInviteDetails',
                'ResetPassword',
            ],
        ]);
    }
    public function VarifyRecaptchaToken($request)
    {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('GOOGLE_SECRET_KEY'),
            'response' => $request->recaptcha_token,
        ]);
        return $response;
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function verifyResetToken(Request $request)
    {
        $verified = PasswordReset::where("token", $request->reset_token)->first();
        if ($verified != null) {
            return response()->json($verified, 200);
        } else {
            return response()->json($verified, 404);
        }
    }
    public function ResetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'reset_token' => 'required|exists:password_resets,token',
        ]);
        if ($validator->fails()) {
            return response()->json(['backenderrors' => $validator->errors()], 422);
        }
        try {
            DB::beginTransaction();
            //update user
            User::where("email", $request->email)->update(['password' => bcrypt($request->password)]);
            //update user
            DB::commit();

            return response()->json(['message' => 'Password updated successfully.'], 201);
        } catch (Exception $exp) {
            DB::rollBack();
            return response()->json(['message' => 'Failed.' . $exp->getMessage()], 422);
        }

    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $isactive = User::where("status", '1')->where("email", $request->email)->first();
        if ($isactive != null) {
            // verify token
            $response = $this->VarifyRecaptchaToken($request);
            // if ($response->successful()) {
            //     $data = $response->json();
            // Process the response data
            // if ($data['success']) {
            if ($isactive != null) {
                if (!$token = auth()->attempt($validator->validated())) {
                    return response()->json(['error' => 'Unauthorized'], 401);
                }
                return $this->createNewToken($token);
            } else {
                return response()->json(['message' => 'Your account is not active'], 403);
            }
            // } else {
            //     $statusCode = $response->status();
            //     return response()->json(['message' => "Failed.  Invalid recaptcha code."], 422);
            //     // reCAPTCHA validation failed
            //     // Handle the validation failure
            // }

            // } else {
            //     // Request to Google reCAPTCHA API failed
            //     $statusCode = $response->status();
            //     return response()->json(['message' => "Failed. Invalid recaptcha code." . $response], 422);
            //     // Handle the error
            // }
        } else {
            return response()->json(['message' => "Inactive account."], 403);
            // Handle the error
        }
    }
    public function generatePasswordResetToken($request)
    {
        $token = Str::random(80);
        return $token;
    }

    public function SendAccountPasswordResetLink(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'recaptcha_token' => 'required',
            'reset_link' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            DB::beginTransaction();
            $isactive = User::where("is_active", 1)->where("email", $request->email)->first();
            if ($isactive != null) {
                //verify token
                $response = $this->VarifyRecaptchaToken($request);
                if ($response->successful()) {
                    $data = $response->json();
                    // Process the response data
                    // if ($data['success']) {
                    // reCAPTCHA validation passed
                    //send reset mail
                    $token = $this->generatePasswordResetToken($request);
                    $saverequest['email'] = $request->email;
                    $saverequest['token'] = $token;
                    $mailsend = Mail::to($request['email'])->send(new SendPasswordResetMail($token, $isactive, $request->reset_link));
                    //send reset mail
                    $passwordreset = PasswordReset::insert($saverequest);
                    DB::commit();
                    if ($passwordreset) {
                        return response()->json(['message' => "Request send succefully. We have send you a reset Link on your email."], 201);
                    } else {
                        return response()->json(['message' => "Failed.Please contact admin"], 422);
                    }
                    // Proceed with your desired logic
                    // } else {
                    //     $statusCode = $response->status();
                    //     return response()->json(['message' => "Failed . Resubmit your request again.", 'recaptha_response' => $data, 'se' => env('GOOGLE_SECRET_KEY')], 422);
                    //     // reCAPTCHA validation failed
                    // Handle the validation failure
                    // }
                } else {

                    // Request to Google reCAPTCHA API failed
                    $statusCode = $response->status();
                    return response()->json(['message' => "Failed. Invalid recaptcha code.", 'recaptha_response' => $response, 'se' => env('GOOGLE_SECRET_KEY')], 422);
                    // Handle the error
                }

                //verify token

            } else {
                return response()->json(['message' => 'Your account does not exist or it has been deactivated.Please contact admin'], 403);
            }
        } catch (Exception $exp) {
            DB::rollBack();
            return response()->json(
                [
                    'message' => 'Failed.' . $exp->getMessage(),
                ],
                422
            );
        }

    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'register_as' => 'required|in:Super Admin,Contributor,Supplier',
            'full_names' => 'required|string|between:2,100',
            'phone_number' => 'required|string',
            'email' => 'required|string|between:2,100|unique:users',
            'password' => ['required', Password::min(6)->letters()->mixedCase()->numbers()->symbols()->uncompromised()],
            'password_confirmation' => 'required|same:password',
        ]);
        if ($validator->fails()) {
            return response()->json(["message" => "Unprocessable data", "backendvalerrors" => $validator->errors()], 400);
        }
        $user = [];
        try {
            // $response = $this->VarifyRecaptchaToken($request);
            // if ($response->successful()) {
            DB::beginTransaction();
            $organization = null;
            $user = null;
            if (strtolower($request->post('register_as')) == 'contributor') {
                $user = User::create(
                    [
                        'full_name' => $request->full_names,
                        'email' => $request->email,
                        'phone_number' => $request->phone_number,
                        'password' => bcrypt($request->password),
                    ]
                );
                $this->generateUserOneTimeInviteForUsers($user);
                $this->generateUserOneTimeInviteForSponsoredUsers($user);
                if ($request->is_invite == 1 && $request->invite_type == "specificlink") {

                    //update details
                    $invite = SystemUserInvite::findOrFail($request->invite);
                    $invite->completed_on = Carbon::now();
                    $invite->completed_user_id = $user->id;
                    $invite->completion_user_id = $user->id;
                    $invite->completed = 1;
                    //  throw new Exception($user->id."Value is greater than ".json_encode($invite));
                    $invite->save();
                    $user->isAdminInvite = $request->invite;
                    $user->save();

                    //update details
                } else if ($request->is_invite == 1 && $request->invite_type == "nonspecificlink") {
                    //update details
                    $oinvite = UserIniviteOneTimeLink::findOrFail($request->invite);
                    $oinvite->invite_count += 1;
                    //  throw new Exception($user->id."Value is greater than ".json_encode($invite));
                    $oinvite->save();

                    //update details
                    //save invite
                    $objectosave['invited_by'] = $oinvite->user_id;
                    $objectosave['invite_token'] = $oinvite->invite_token;
                    $objectosave['registration_link'] = "one time";
                    $objectosave['invite_name'] = $request->full_names;
                    $objectosave['invite_email'] = $request->email;
                    $objectosave['invite_phone'] = $request->phone_number;
                    $objectosave['completed_user_id'] = $user->id;
                    $objectosave['completion_user_id'] = $user->id;

                    $objectosave['completed_on'] = Carbon::now();
                    $objectosave['completed'] = 1;
                    $created_inviteentry = SystemUserInvite::create($objectosave);
                    $user->isAdminInvite = $created_inviteentry->id;
                    $user->save();
                    //save invite

                }

                $uploaderadmin_role = Role::where('slug', 'contributor')->first();
                $user->roles()->attach($uploaderadmin_role);
            } else if (strtolower($request->post('register_as')) == 'Supplier') {
                //get admin account user
                if (auth()->user() == null) {
                    return response()->json([
                        'code' => 0,
                        'message' => 'Unauthorized access',
                    ], 401);
                } else {
                    $user = User::create(
                        [
                            'full_name' => $request->full_name,
                            'email' => $request->email,
                            'phone_number' => $request->phone_number,
                            'password' => bcrypt($request->password),
                        ]
                    );
                    $uploader_role = Role::where('slug', 'supplier')->first();
                    $user->roles()->attach($uploader_role);
                }
            } else if (strtolower($request->post('register_as')) == 'super admin') {
                $user = User::create(
                    [
                        'full_name' => $request->full_names,
                        'email' => $request->email,
                        'phone_number' => $request->phone_number,
                        'password' => bcrypt($request->password),
                    ]
                );
                $superadmin_role = Role::where('slug', 'super admin')->first();
                $user->roles()->attach($superadmin_role);
            }
            DB::commit();
            return response()->json([
                'message' => 'Account has been created successfully. Please Login to continue',
                'register_as' => $request->post('register_as'),
                'user' => $user,
                'roles' => ($user) ? $user->roles()->get() : "No account was created",
            ], 201);
            // }else{
            //     $statusCode = $response->status();
            //     return response()->json(['message' => "Failed. Invalid recaptcha code." . $response], 422);
            // }

        } catch (\Exception $exp) {
            DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
            return response()->json([
                'message' => 'Account has not been created successfully ' . $exp->getMessage(),

            ], 400);

        }

    }
    public function inviteUser(Request $request)
    {
        if (auth()->check()) {
            $user = auth()->user();
            $validator = Validator::make($request->all(), [
                'invite_name' => 'required|string|between:2,100',
                'invite_phone' => 'required|string',
                'invite_email' => 'required|string|between:2,100|unique:system_user_invites',
            ]);
            if ($validator->fails()) {
                return response()->json(["message" => "Unprocessable data", "backendvalerrors" => $validator->errors()], 400);
            }
            try {
                DB::beginTransaction();
                //create in vite
                $objectosave['invited_by'] = $user->id;
                $objectosave['invite_token'] = $this->generateInviteToken($request);
                $objectosave['registration_link'] = $request->registration_link;
                $objectosave['invite_name'] = $request->invite_name;
                $objectosave['invite_email'] = $request->invite_email;
                $objectosave['invite_phone'] = $request->invite_phone;
                $invite = SystemUserInvite::create($objectosave);
                //create Invit1e
                //send email
                Mail::to($request['invite_email'])->send(new SendContributorInviteMail($objectosave['invite_token'], $objectosave['registration_link'], $user, $invite));
                //send  email
                DB::commit();
                return response()->json([
                    'message' => 'Invite send successfully',
                    'invite' => $invite,
                ], 201);
            } catch (\Exception $exp) {
                DB::rollBack(); // Tell Laravel, "It's not you, it's me. Please don't persist to DB"
                return response()->json([
                    'message' => 'Account has not been created successfully' . $exp->getMessage(),
                ], 400);
            }

        } else {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

    }
    public function retrieveInviteDetails(Request $request)
    {
        $invite = SystemUserInvite::where("invite_token", $request->invite_token)->whereNull("completed_user_id")->first();
        return $invite;
    }
    public function retrieveOInviteDetails(Request $request)
    {
        $userinvite = UserIniviteOneTimeLink::where("invite_token", $request->invite_token)->first();
        return $userinvite;

    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile()
    {
        return response()->json(auth()->user());
    }
    public function userProfileDetails(Request $request)
    {
        $user = User::where("id", $request->user_id)->first();
        if ($user != null) {

            $role = $user->roles()->first(["id", "name", "name as role_name"]);
            $userid = ['user_id' => $request->user_id];
            return response()->json([
                'user' => array_merge($user->toArray(), $role->toArray(), $userid),
                'role' => $role,
                'user_id' => $user,
                'roles' => $user->roles()->get(["id", "name"]),
                'permissions' => array_merge($role->permissions()->get(['id', 'slug as name'])->toArray()),
            ]);

        } else {
            return response()->json(['message' => 'user not found'], 404);

        }

    }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userDetails(Request $request)
    {
        $loggeduser = auth()->user();
        try {
            $thisuser = User::where("id", $request->user)->first();

            if ($loggeduser->hasRole("admin")) {

            } else if ($loggeduser->hasRole("owner")) {
                $thisuser->makeHidden(['created_at', 'updated_at', 'nin_number', 'phone_number', 'email_verified_at']);
            }

            $getuser = $thisuser;
            return response()->json(['user' => $getuser, 'user_properties' => $getuser->properties()->get()], 200);
        } catch (Exception $e) {
            return response()->json(
                [
                    'user' => null,
                    'error' => $e->getMessage(),
                ]
            );
        }

    }
    public function getMyInviteToken($user)
    {

        $invite = UserIniviteOneTimeLink::where("user_id", $user)->first();
        if ($invite != null) {
            return $invite->invite_token;
        } else {
            return "";
        }

    }
    public function getSystemWallet()
    {
        return SystemPaymentDetail::first();
    }
    public function getUserWallet($user)
    {
        return ContributorAccount::where("user_id", $user)->first();
    }
    protected function createNewToken($token)
    {
        $role = auth()->user()->roles()->first(["id", "name", "name as role_name"]);
        $userid = ['user_id' => auth()->user()->id];
        $user = auth()->user();
        return response()->json([
            'message' => 'Logged in successfully. Welcome to ' . env("APP_NAME"),
            'access_token' => $token,
            'invite_token' => $this->getMyInviteToken($userid),
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => array_merge($user->toArray(), $role->toArray(), $userid),
            'role' => $role,
            'user_id' => $user,
            'syswallet' => $this->getSystemWallet(),
            'userwallet' => $this->getUserWallet($userid),
            'roles' => $user->roles()->get(["id", "name"]),
            'permissions' => array_merge($user->permissions()->get(["id", "slug as name"])->toArray(), $role->permissions()->get(['id', 'slug as name'])->toArray()),
        ]);
    }

    public function generateInviteToken($request)
    {
        $isOtherToken = DB::table('system_user_invites')->where('invite_email', $request['email'])->first();
        if ($isOtherToken) {
            return $isOtherToken->token;
        }
        $token = Str::random(80);
        return $token;
    }

    public function allUsers()
    {
        return response()->json(["users" => User::all()]);
    }
    public function generateUserOneTimeInviteForUsers($user)
    {
        $objecttosave['user_id'] = $user->id;
        $objecttosave['invite_token'] = $this->generateOneTimeInviteToken($user);
        UserIniviteOneTimeLink::create($objecttosave);
        return true;
    }
    public function generateUserOneTimeInviteForSponsoredUsers($user)
    {
        $objecttosave['user_id'] = $user->id;
        $objecttosave['invite_token'] = $this->generateOneTimeInviteToken($user);
        $objecttosave['user_id'] = $user->id;
        UserIniviteOneTimeLink::create($objecttosave);
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

}
