<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();               // Starter / Growth / Enterprise
            $table->string('description')->nullable();
            $table->unsignedInteger('monthly_price');       // in dollars
            $table->unsignedInteger('yearly_price');
            $table->unsignedInteger('product_limit')->nullable();      // null = unlimited
            $table->unsignedInteger('admin_user_limit')->nullable();
            $table->unsignedInteger('custom_domain_limit')->nullable();
            $table->json('features');
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();               // {slug}.storeforge.io
            $table->foreignId('plan_id')->constrained();
            $table->enum('billing_cycle', ['monthly', 'yearly'])->default('monthly');
            $table->enum('status', ['trial', 'active', 'cancelled'])->default('trial');
            $table->timestamp('trial_ends_at')->nullable();
            $table->string('theme_color')->default('#FF5A36');
            $table->string('support_email')->nullable();
            $table->string('support_phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
        Schema::dropIfExists('plans');
    }
};
