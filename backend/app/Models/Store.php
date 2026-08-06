<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Landlord-database tenant registry. Each store's commerce data lives in its
 * OWN database (see the `database` column + App\Services\TenantDatabase).
 */
class Store extends Model
{
    protected $fillable = [
        'name', 'slug', 'database', 'plan_id', 'billing_cycle', 'status', 'trial_ends_at',
        'stripe_customer_id', 'stripe_subscription_id',
        'theme_color', 'support_email', 'support_phone', 'address',
    ];

    protected $casts = ['trial_ends_at' => 'datetime'];

    public function plan(): BelongsTo { return $this->belongsTo(Plan::class); }
    public function users(): HasMany { return $this->hasMany(User::class); }
    public function invoices(): HasMany { return $this->hasMany(Invoice::class); }
}
