<?php

// TENANT DATABASE ({TENANT_DB_PREFIX}{slug}) — one per store, no store_id
// columns: the database itself is the isolation boundary (NFR-01).

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->unique();
            $table->unsignedInteger('price');
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->string('emoji')->default('📦');
            $table->string('image_url')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->boolean('featured')->default(false);
            $table->boolean('latest')->default(false);
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->enum('kind', ['Homepage Banner', 'Category Banner', 'Offer Banner']);
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('color1')->default('#0F172A');
            $table->string('color2')->default('#16213E');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
