<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\ContributorController;
use App\Http\Controllers\PasswordResetRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
], function ($router) {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'SendAccountPasswordResetLink']);
    Route::post('/reset-password', [AuthController::class, 'ResetPassword']);
    Route::get('/all-users', [AuthController::class, 'allUsers']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/invite-user', [AuthController::class, 'inviteUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/user-information', [AuthController::class, 'userProfileDetails']);
    Route::get('/verify-reset-token', [AuthController::class, 'verifyResetToken']);
    Route::get('/retrieve-invite-details', [AuthController::class, 'retrieveInviteDetails']);
    Route::get('/retrieve-oinvite-details ', [AuthController::class, 'retrieveOInviteDetails']);

});
Route::group([
    'middleware' => 'api',
    'prefix' => 'commons',
], function ($router) {
    Route::get('/get-all-contributions', [CommonController::class, 'getAllContributions']);

    Route::get('/get-all-categories', [CommonController::class, 'getAllCategories']);
    Route::get('/get-refresh-sponsored-link', [CommonController::class, 'getRefreshSponsoredLink']);
    Route::get('/get-refresh-normal-invite-link', [CommonController::class, 'getRefreshNormalInviteLink']);

    
    Route::get('/get-all-tiers', [CommonController::class, 'getAllTiers']);
    Route::get('/get-all-products', [CommonController::class, 'getAllProducts']);
    Route::get('/get-all-ordered-products', [CommonController::class, 'getAllOrderedProducts']);
    Route::get('/get-all-links', [CommonController::class, 'getAllSubLinks']);
    Route::get('/get-user-sub-links', [CommonController::class, 'getAllUserSubLinks']);
    Route::post('/save-user-subscription-link', [CommonController::class, 'saveUserRegistrationLink']);
    Route::get('/get-user-link-invitees', [CommonController::class, 'getUserLinkInviteees']);
    Route::post('/get-paybacks', [CommonController::class, 'getContributionPaybacks']);
    Route::get('/check-user-tier-approval', [AdminController::class, 'checkUserTierApproval']);
    Route::get('/get-tier-contribution-details', [AdminController::class, 'getTierContributionDetails']);
    Route::post('/update-personal-information', [CommonController::class, 'updatePersonalInformation']);
    Route::post('/save-cart', [CommonController::class, 'saveCart']);
    Route::get('/get-orders', [CommonController::class, 'getOrders']);

});
Route::group([
    'middleware' => 'api',
    'prefix' => 'contributor',
], function ($router) {
    Route::post('/invest', [ContributorController::class, 'invest']);
    Route::get('/get-my-investments', [ContributorController::class, 'getMyInvestments']);
    Route::get('/get-my-invites', [ContributorController::class, 'getMyInvites']);
    Route::get('/get-my-dashboard', [ContributorController::class, 'getMyDashboard']);
    Route::get('/get-my-profile-data', [ContributorController::class, 'getMyProfileData']);

});

Route::group([
    'middleware' => 'api',
    'prefix' => 'admin',
], function ($router) {

    

    Route::post('/transist-to-phases', [AdminController::class, 'exitUserToPhase']);

    Route::get('/get-sponsor-links', [AdminController::class, 'getRegistredSponsorshipLinks']);
    

    Route::post('/sync-sponsorship-links', [AdminController::class, 'syncsponsorship']);
    Route::get('/get-sponsorship-links', [AdminController::class, 'getSponsorshipLinks']);
    Route::post('/add-role', [AdminController::class, 'addRoles']);
    Route::patch('/update-role/{id}', [AdminController::class, 'updateRole']);
    Route::delete('/delete-role/{id}', [AdminController::class, 'deleteRole']);
    Route::get('/get-all-roles', [AdminController::class, 'getAllRoles']);
    Route::get('/get-all-permissions', [AdminController::class, 'getAllPermissions']);
    Route::post('/add-permissions', [AdminController::class, 'addPermissions']);
    Route::post('/assign-role-permissions', [AdminController::class, 'assignRolePermissions']);
    Route::post('/send-accesor-invite', [AdminController::class, 'sendAccesorInvite']);
    Route::get('/get-dashboard', [AdminController::class, 'getDashboard']);
    Route::get('/get-payments', [AdminController::class, 'payments']);
    Route::post('/approve-payment', [AdminController::class, 'verifyPayment']);
    Route::get('/get-users', [AdminController::class, 'getUsers']);
    Route::post('/deactivate-activate-user', [AdminController::class, 'activateDeactivateUser']);
    //supplier
    Route::post('add-supplier', [AdminController::class, 'addSupplier']);
    Route::get('get-all-suppliers', [AdminController::class, 'getAllSuppliers']);
    Route::post('update-supplier', [AdminController::class, 'updateSupplier']);
    Route::post('add-supplier-product', [AdminController::class, 'addSupplierProduct']);
    Route::post('update-supplier-product', [AdminController::class, 'updateSupplierProduct']);
    Route::post('delete-supplier-product', [AdminController::class, 'deleteSupplierProduct']);
    //supplier
    //category
    Route::post('add-category', [AdminController::class, 'addCategory']);
    Route::post('update-category', [AdminController::class, 'updateCategory']);
    //category
    //sub links
    Route::post('add-subscription-link', [AdminController::class, 'addSubscriptionLinks']);
    Route::post('update-subscription-link', [AdminController::class, 'updateSubscriptionLinks']);
    //sub links
    Route::get('/generate-user-one-time-invites', [AdminController::class, 'generateUserOneTimeInviteForUsers']);

    Route::post('/get-user-link-invitees', [AdminController::class, 'getUserLinkInvitees']);
    Route::post('/pay-member', [AdminController::class, 'payMember']);
    Route::post('/pay-member-bonus', [AdminController::class, 'payMemberBonus']);

    Route::get('/get-tier-earnings', [AdminController::class, 'getTierEarnings']);
    Route::get('/get-bonus-payments', [AdminController::class, 'bonusPayments']);
    Route::get('/get-company-payments', [AdminController::class, 'companyPayments']);

    Route::get('/donwload-payment-proof', [AdminController::class, 'download']);

    Route::post('/update-order-product-status', [AdminController::class, 'updateOrderProductStatus']);

    Route::post('/sync-expected-sponsorship-amounts', [AdminController::class, 'syncSponsorshipsEntriesOnContributions']);
    Route::post('/sync-registered-sponsors-to-contributions', [AdminController::class, 'syncRegisteredSponsorshipsOnContributions']);

    

  
    

});
Route::post('/reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
Route::post('/change-password', [ChangePasswordController::class, 'passwordResetProcess']);



