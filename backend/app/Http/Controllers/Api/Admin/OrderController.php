<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /** GET /api/v1/admin/orders (ADM-05) */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->store->orders()->withCount('items')->orderByDesc('placed_at')->get()
                ->map(fn (Order $o) => $this->transform($o)),
        );
    }

    /** PUT /api/v1/admin/orders/{order}  {status?, tracking?} */
    public function update(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->store_id === $request->user()->store_id, 404);

        $data = $request->validate([
            'status' => ['nullable', 'in:Pending,Processing,Shipped,Out for Delivery,Delivered,Cancelled'],
            'tracking' => ['nullable', 'string', 'max:60'],
        ]);

        $order->update(array_filter([
            'status' => $data['status'] ?? null,
            'tracking_number' => $data['tracking'] ?? null,
        ], fn ($v) => $v !== null));

        return response()->json($this->transform($order->fresh()->loadCount('items')));
    }

    private function transform(Order $o): array
    {
        return [
            'id' => $o->number,
            'orderId' => $o->id,                    // numeric id for PUT calls
            'customer' => $o->customer_name,
            'date' => $o->placed_at?->format('d M Y'),
            'items' => $o->items_count ?? $o->items()->count(),
            'total' => $o->total,
            'status' => $o->status,
            'tracking' => $o->tracking_number ?? '',
            'addr' => $o->delivery_address,
            'phone' => $o->customer_phone,
            'payment' => $o->payment_method === 'COD' ? 'Cash on Delivery' : 'Card',
        ];
    }
}
