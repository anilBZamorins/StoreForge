<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'store_id', 'category_id', 'name', 'sku', 'price', 'discount_percent', 'stock',
        'emoji', 'image_url', 'rating', 'featured', 'latest', 'short_description', 'description',
    ];

    protected $casts = ['featured' => 'boolean', 'latest' => 'boolean', 'rating' => 'float'];

    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }

    public function finalPrice(): int
    {
        return (int) round($this->price * (1 - $this->discount_percent / 100));
    }

    public function stockStatus(): string
    {
        if ($this->stock === 0) return 'Out of Stock';
        if ($this->stock < 10) return 'Low Stock';
        return 'Active';
    }
}
