<?php

// SUPERSEDED — tenant tables moved to their own per-tenant databases.
// See database/migrations/tenant/. This file is intentionally a no-op and
// can be deleted before your first `php artisan migrate`.

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void {}

    public function down(): void {}
};
