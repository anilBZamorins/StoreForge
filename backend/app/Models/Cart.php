<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $connection = 'tenant';

    protected $fillable = ['customer_id', 'last_activity_at'];

    protected $casts = ['last_activity_at' => 'datetime'];

    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function items(): HasMany { return $this->hasMany(CartItem::class); }

    /** Active < 24h, Idle 24h–7d, Abandoned > 7d (BRD Section 7). */
    public function state(): string
    {
        $hours = $this->last_activity_at->diffInHours(now());
        if ($hours < 24) return 'Active';
        if ($hours < 168) return 'Idle';
        return 'Abandoned';
    }
}
