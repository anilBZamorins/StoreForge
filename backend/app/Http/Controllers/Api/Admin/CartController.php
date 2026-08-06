<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /** GET /api/v1/admin/carts (ADM-06) — carts pending checkout */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Cart::with(['customer', 'items'])->orderBy('last_activity_at')->get()
                ->map(fn (Cart $c) => [
                    'id' => $c->id,
                    'customer' => $c->customer?->name ?? 'Guest',
                    'email' => $c->customer?->email ?? '',
                    'phone' => $c->customer?->phone ?? '',
                    'items' => $c->items->map(fn ($i) => ['pid' => $i->product_id, 'qty' => $i->quantity]),
                    'hoursIdle' => (int) $c->last_activity_at->diffInHours(now()),
                ]),
        );
    }
}
