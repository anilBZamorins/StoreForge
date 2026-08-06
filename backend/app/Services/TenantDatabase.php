<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Facades\DB;

/**
 * Points the runtime 'tenant' connection at a specific store's database.
 * Every tenant model declares `protected $connection = 'tenant'`, so after
 * TenantDatabase::use($store) all tenant queries hit that store's own DB.
 */
class TenantDatabase
{
    public static function use(Store $store): void
    {
        config(['database.connections.tenant.database' => $store->database]);
        DB::purge('tenant');
        DB::reconnect('tenant');
    }

    public static function databaseNameFor(string $slug): string
    {
        return env('TENANT_DB_PREFIX', 'storeforge_') . $slug;
    }
}
