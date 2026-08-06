<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /** GET /api/v1/admin/settings (ADM-10) */
    public function show(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        return response()->json([
            'storeName' => $store->name,
            'domain' => $store->slug . '.storeforge.io',
            'themeColor' => $store->theme_color,
            'supportEmail' => $store->support_email,
            'supportPhone' => $store->support_phone,
            'address' => $store->address,
            'plan' => $store->plan->name,
            'billingCycle' => $store->billing_cycle,
            'status' => $store->status,
        ]);
    }

    /** PUT /api/v1/admin/settings */
    public function update(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        $data = $request->validate([
            'storeName' => ['sometimes', 'string', 'max:100'],
            'themeColor' => ['sometimes', 'string', 'max:9'],
            'supportEmail' => ['sometimes', 'nullable', 'email'],
            'supportPhone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $store->update(array_filter([
            'name' => $data['storeName'] ?? null,
            'theme_color' => $data['themeColor'] ?? null,
            'support_email' => $data['supportEmail'] ?? null,
            'support_phone' => $data['supportPhone'] ?? null,
            'address' => $data['address'] ?? null,
        ], fn ($v) => $v !== null));

        return $this->show($request);
    }
}
