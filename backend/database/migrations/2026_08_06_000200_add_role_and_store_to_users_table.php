<?php

// LANDLORD DATABASE — adds StoreForge columns to users. Guarded.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['super_admin', 'store_owner', 'store_admin'])->default('store_owner')->after('password');
            }
            if (! Schema::hasColumn('users', 'store_id')) {
                $table->foreignId('store_id')->nullable()->after('password')->constrained()->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'store_id')) {
                $table->dropConstrainedForeignId('store_id');
            }
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
