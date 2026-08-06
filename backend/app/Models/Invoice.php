<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = ['store_id', 'number', 'plan_name', 'amount', 'status', 'issued_at'];

    protected $casts = ['issued_at' => 'datetime'];

    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
}
