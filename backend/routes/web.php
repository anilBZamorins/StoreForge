
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\GoogleController;
//Route::get('/google/callback', [GoogleAuthController::class, 'callback']);

// Route::get('/google/auth-url', [GoogleAuthController::class, 'getAuthUrl']);
// Route::get('/google/auth-refresh', [GoogleAuthController::class, 'authorizeWithRefreshToken']);
// Route::get('/google/callback', [GoogleAuthController::class, 'callback']);
// Route::get('/send-test-email', [MailController::class, 'sendTest']);
// Route::get('/send-test-email-att', [MailController::class, 'sendEmailWithAttachments']);
// Route::get('/send-test-email-refresh', [MailController::class, 'sendEmailUsingRefresh()']);

 Route::get('/google/login', [GoogleController::class, 'login']);
Route::get('/google/callback', [GoogleController::class, 'callback']);