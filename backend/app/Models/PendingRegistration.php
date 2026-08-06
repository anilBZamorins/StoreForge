<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingRegistration extends Model
{
    protected $fillable = [
        'stripe_session_id', 'business_name', 'owner_name', 'email',
        'password_hash', 'plan_name', 'billing_cycle', 'status', 'result',
    ];

    protected $casts = ['result' => 'array'];
}
