<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Plan;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Automated tenant provisioning (PRV-01..06):
 * creates the tenant's OWN database, migrates it, creates default catalog
 * structure inside it, and registers the store + owner in the landlord DB.
 */
class ProvisionTenant
{
    /**
     * @return array{store: Store, temporaryPassword: string}
     */
    public function provision(
        string $businessName,
        string $ownerName,
        string $ownerEmail,
        ?string $password,
        Plan $plan,
        string $billingCycle = 'monthly',
        bool $trial = true,
        ?string $stripeCustomerId = null,
        ?string $stripeSubscriptionId = null,
    ): array {
        $slug = $this->uniqueSlug($businessName);
        $temporaryPassword = $password ?? ('Tmp#' . Str::random(8));

        // 1. Landlord records
        $store = Store::create([
            'name' => $businessName,
            'slug' => $slug,
            'database' => TenantDatabase::databaseNameFor($slug),
            'plan_id' => $plan->id,
            'billing_cycle' => $billingCycle,
            'status' => $trial ? 'trial' : 'active',
            'trial_ends_at' => $trial ? now()->addDays(14) : null,
            'stripe_customer_id' => $stripeCustomerId,
            'stripe_subscription_id' => $stripeSubscriptionId,
        ]);

        User::create([
            'name' => $ownerName,
            'email' => $ownerEmail,
            'password' => Hash::make($temporaryPassword),
            'role' => 'store_owner',
            'store_id' => $store->id,
        ]);

        // 2. Tenant database + schema
        $this->createDatabase($store);
        $this->migrate($store);

        // 3. Default catalog structure inside the tenant DB (PRV-04)
        TenantDatabase::use($store);
        Category::firstOrCreate(['slug' => 'general'], ['name' => 'General', 'parent_id' => null]);

        return ['store' => $store, 'temporaryPassword' => $temporaryPassword];
    }

    public function createDatabase(Store $store): void
    {
        DB::statement(sprintf(
            'CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
            str_replace('`', '', $store->database),
        ));
    }

    public function migrate(Store $store): void
    {
        TenantDatabase::use($store);
        Artisan::call('migrate', [
            '--database' => 'tenant',
            '--path' => 'database/migrations/tenant',
            '--force' => true,
        ]);
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
