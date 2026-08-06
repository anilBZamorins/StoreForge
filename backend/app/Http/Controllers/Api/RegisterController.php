<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    /**
     * POST /api/v1/register — self-service tenant provisioning (PRV-01..06).
     * Creates the store, default catalog structure, and the owner account.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'businessName' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'plan' => ['required', 'exists:plans,name'],
            'billingCycle' => ['nullable', 'in:monthly,yearly'],
            'trial' => ['nullable', 'boolean'],
        ]);

        $slug = $this->uniqueSlug($data['businessName']);
        $temporaryPassword = $data['password'] ?? ('Tmp#' . Str::random(8));
        $trial = $data['trial'] ?? true;

        $store = DB::transaction(function () use ($data, $slug, $temporaryPassword, $trial) {
            $plan = Plan::where('name', $data['plan'])->firstOrFail();

            $store = Store::create([
                'name' => $data['businessName'],
                'slug' => $slug,
                'plan_id' => $plan->id,
                'billing_cycle' => $data['billingCycle'] ?? 'monthly',
                'status' => $trial ? 'trial' : 'active',
                'trial_ends_at' => $trial ? now()->addDays(14) : null,
            ]);

            // Default catalog structure (PRV-04)
            $store->categories()->create(['name' => 'General', 'slug' => 'general', 'parent_id' => null]);

            User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($temporaryPassword),
                'role' => 'store_owner',
                'store_id' => $store->id,
            ]);

            return $store;
        });

        return response()->json([
            'storeUrl' => $store->slug . '.storeforge.io',
            'adminEmail' => $data['email'],
            'temporaryPassword' => $temporaryPassword,
        ], 201);
    }

    private function uniqueSlug(string $businessName): string
    {
        $base = Str::of($businessName)->lower()->replaceMatches('/[^a-z0-9]+/', '')->substr(0, 20)->toString() ?: 'store';
        $slug = $base;
        $i = 1;
        while (Store::where('slug', $slug)->exists()) {
            $slug = $base . ++$i;
        }
        return $slug;
    }
}
