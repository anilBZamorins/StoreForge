<?php

use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\CartController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\InvoiceController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\Store\OrderController as StoreOrderController;
use App\Http\Controllers\Api\Store\StorefrontController;
use App\Http\Middleware\ResolveStore;
use App\Http\Middleware\UseTenantDatabase;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ---------- Public (frontend-website) ----------
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/plans', [PlanController::class, 'index']);
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/register/status', [RegisterController::class, 'status']);
    Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
    Route::post('/contact', [ContactController::class, 'store']);

    // ---------- Authenticated (Sanctum bearer token) ----------
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // ---------- Store Admin (frontend-admin) ----------
        Route::prefix('admin')->middleware(UseTenantDatabase::class)->group(function () {
            Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

            Route::get('/products', [ProductController::class, 'index']);
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);

            Route::get('/categories', [CategoryController::class, 'index']);
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{slug}', [CategoryController::class, 'update']);
            Route::delete('/categories/{slug}', [CategoryController::class, 'destroy']);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::put('/orders/{order}', [AdminOrderController::class, 'update']);

            Route::get('/customers', [CustomerController::class, 'index']);
            Route::get('/carts', [CartController::class, 'index']);

            Route::get('/banners', [BannerController::class, 'index']);
            Route::post('/banners', [BannerController::class, 'store']);
            Route::put('/banners/{banner}', [BannerController::class, 'update']);

            Route::get('/invoices', [InvoiceController::class, 'index']);

            Route::get('/settings', [SettingsController::class, 'show']);
            Route::put('/settings', [SettingsController::class, 'update']);
        });
    });

    // ---------- Public storefront (frontend-storefront) ----------
    // Tenant resolved from X-Store header, ?store= query, or subdomain.
    Route::prefix('store')->middleware(ResolveStore::class)->group(function () {
        Route::get('/slides', [StorefrontController::class, 'slides']);
        Route::get('/categories', [StorefrontController::class, 'categories']);
        Route::get('/products', [StorefrontController::class, 'products']);
        Route::get('/products/{id}', [StorefrontController::class, 'product']);
        Route::get('/orders', [StoreOrderController::class, 'index']);
        Route::post('/orders', [StoreOrderController::class, 'store']);
        Route::post('/contact', [ContactController::class, 'store']);
    });
});
