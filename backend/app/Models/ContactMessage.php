<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Platform enquiries live in the landlord DB; storefront enquiries are written
 * into the tenant DB via ContactMessage::on('tenant')->create([...]).
 */
class ContactMessage extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'topic', 'order_number', 'message'];
}
