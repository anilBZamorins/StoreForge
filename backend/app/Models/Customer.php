<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $connection = 'tenant';

    protected $fillable = ['name', 'email', 'phone', 'city', 'joined_at'];

    protected $casts = ['joined_at' => 'datetime'];

    public function orders(): HasMany { return $this->hasMany(Order::class); }
    public function carts(): HasMany { return $this->hasMany(Cart::class); }
}
