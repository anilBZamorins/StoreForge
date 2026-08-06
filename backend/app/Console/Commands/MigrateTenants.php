<?php

namespace App\Console\Commands;

use App\Models\Store;
use App\Services\ProvisionTenant;
use Illuminate\Console\Command;

/**
 * Runs the tenant migrations against EVERY tenant database.
 * Use after adding a migration to database/migrations/tenant/.
 *
 *   php artisan tenants:migrate
 */
class MigrateTenants extends Command
{
    protected $signature = 'tenants:migrate {--store= : Only this store slug}';

    protected $description = 'Run tenant migrations for all (or one) tenant databases';

    public function handle(ProvisionTenant $provisioner): int
    {
        $stores = Store::query()
            ->when($this->option('store'), fn ($q, $slug) => $q->where('slug', $slug))
            ->get();

        foreach ($stores as $store) {
            $this->info("Migrating {$store->slug} ({$store->database})…");
            $provisioner->createDatabase($store);
            $provisioner->migrate($store);
        }

        $this->info("Done — {$stores->count()} tenant database(s) migrated.");

        return self::SUCCESS;
    }
}
