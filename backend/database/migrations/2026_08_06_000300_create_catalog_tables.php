<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');                          // e.g. bedding, rugs
            $table->string('description')->nullable();
            $table->timestamps();
            $table->unique(['store_id', 'slug']);
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();   // sub-category
            $table->string('name');
            $table->string('sku');
            $table->unsignedInteger('price');                // in dollars
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->string('emoji')->default('📦');          // placeholder until image uploads
            $table->string('image_url')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->boolean('featured')->default(false);
            $table->boolean('latest')->default(false);
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique(['store_id', 'sku']);
        });

        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
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
