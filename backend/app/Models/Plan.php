<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name', 'description', 'monthly_price', 'yearly_price',
        'product_limit', 'admin_user_limit', 'custom_domain_limit', 'features', 'featured',
    ];

    protected $casts = ['features' => 'array', 'featured' => 'boolean'];

    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }
}
