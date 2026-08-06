<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'name', 'slug', 'plan_id', 'billing_cycle', 'status', 'trial_ends_at',
        'theme_color', 'support_email', 'support_phone', 'address',
    ];

    protected $casts = ['trial_ends_at' => 'datetime'];

    public function plan(): BelongsTo { return $this->belongsTo(Plan::class); }
    public function users(): HasMany { return $this->hasMany(User::class); }
    public function categories(): HasMany { return $this->hasMany(Category::class); }
    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function customers(): HasMany { return $this->hasMany(Customer::class); }
    public function orders(): HasMany { return $this->hasMany(Order::class); }
    public function carts(): HasMany { return $this->hasMany(Cart::class); }
    public function banners(): HasMany { return $this->hasMany(Banner::class); }
    public function invoices(): HasMany { return $this->hasMany(Invoice::class); }
}
