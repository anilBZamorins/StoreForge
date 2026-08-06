<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['store_id', 'name', 'email', 'phone', 'topic', 'order_number', 'message'];
}
