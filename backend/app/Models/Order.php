<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    protected $fillable = [
        'store_id', 'customer_id', 'number', 'status', 'payment_method', 'total',
        'tracking_number', 'customer_name', 'customer_phone', 'delivery_address', 'placed_at',
    ];

    protected $casts = ['placed_at' => 'datetime'];

    public function store(): BelongsTo { return $this->belongsTo(Store::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
}
