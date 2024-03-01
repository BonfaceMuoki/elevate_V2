<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', [HomeController::class, 'home']);
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'SendAccountPasswordResetLink']);
    Route::post('/reset-password', [AuthController::class, 'ResetPassword']);  
    Route::post('/register', [AuthController::class, 'register']);     
});
