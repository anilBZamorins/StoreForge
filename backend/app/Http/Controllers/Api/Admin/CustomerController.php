<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /** GET /api/v1/admin/customers (ADM-07) */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->store->customers()
                ->withCount('orders')->withSum('orders', 'total')->orderBy('name')->get()
                ->map(fn (Customer $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'email' => $c->email,
                    'phone' => $c->phone,
                    'city' => $c->city,
                    'orders' => $c->orders_count,
                    'spent' => (int) ($c->orders_sum_total ?? 0),
                    'joined' => $c->joined_at?->format('d M Y'),
                ]),
        );
    }
}
