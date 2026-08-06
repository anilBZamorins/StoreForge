<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Banner extends Model
{
    protected $fillable = ['store_id', 'kind', 'title', 'subtitle', 'color1', 'color2', 'active'];

    protected $casts = ['active' => 'boolean'];

    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
}
