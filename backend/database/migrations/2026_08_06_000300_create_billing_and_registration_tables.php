<?php

// LANDLORD DATABASE (storeforge) — subscription invoices, platform enquiries,
// and Stripe-pending registrations awaiting checkout completion.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('number');
            $table->string('plan_name');
            $table->unsignedInteger('amount');
            $table->enum('status', ['Paid', 'Failed', 'Pending'])->default('Paid');
            $table->string('stripe_invoice_id')->nullable();
            $table->timestamp('issued_at');
            $table->timestamps();
            $table->unique(['store_id', 'number']);
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('topic')->nullable();
            $table->text('message');
            $table->timestamps();
        });

        Schema::create('pending_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('stripe_session_id')->nullable()->unique();
            $table->string('business_name');
            $table->string('owner_name');
            $table->string('email');
            $table->string('password_hash')->nullable();     // null => temp password generated at provisioning
            $table->string('plan_name');
            $table->enum('billing_cycle', ['monthly', 'yearly'])->default('monthly');
            $table->enum('status', ['awaiting_payment', 'completed', 'failed'])->default('awaiting_payment');
            $table->json('result')->nullable();              // {storeUrl, adminEmail} once provisioned
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pending_registrations');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('invoices');
    }
};
