<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * GET /api/v1/store/orders?email= (STF-09)
     * With ?email=, returns that customer's orders; without, recent store orders (demo).
     */
    public function index(Request $request): JsonResponse
    {
        $store = $request->attributes->get('store');

        $query = Order::withCount('items')->orderByDesc('placed_at');
        if ($email = $request->query('email')) {
            $query->whereHas('customer', fn ($q) => $q->where('email', $email));
        }

        return response()->json($query->limit(20)->get()->map(fn (Order $o) => [
            'id' => $o->number,
            'date' => $o->placed_at?->format('d M Y'),
            'items' => $o->items_count,
            'total' => $o->total,
            'status' => $o->status,
        ]));
    }

    /** POST /api/v1/store/orders (STF-07/08) — place a COD order */
    public function store(Request $request): JsonResponse
    {
        $store = $request->attributes->get('store');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:50'],
            'zip' => ['nullable', 'string', 'max:20'],
            'paymentMethod' => ['nullable', 'in:COD'],       // Card is Phase 2
            'items' => ['required', 'array', 'min:1'],
            'items.*.productId' => ['required', 'integer'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
        ]);

        $order = DB::transaction(function () use ($store, $data) {
            $customer = null;
            if (! empty($data['email'])) {
                $customer = Customer::firstOrCreate(
                    ['email' => $data['email']],
                    ['name' => $data['name'], 'phone' => $data['phone'], 'city' => $data['city'], 'joined_at' => now()],
                );
            }

            $address = trim("{$data['address']}, {$data['city']}" .
                (empty($data['state']) ? '' : ", {$data['state']}") .
                (empty($data['zip']) ? '' : " {$data['zip']}"));

            $prefix = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $store->name) ?: 'SF', 0, 2));
            $number = $prefix . '-' . str_pad((string) (Order::count() + 3100), 4, '0', STR_PAD_LEFT);

            $order = Order::create([
                'customer_id' => $customer?->id,
                'number' => $number,
                'status' => 'Pending',
                'payment_method' => $data['paymentMethod'] ?? 'COD',
                'total' => 0,
                'customer_name' => $data['name'],
                'customer_phone' => $data['phone'],
                'delivery_address' => $address,
                'placed_at' => now(),
            ]);

            $total = 0;
            foreach ($data['items'] as $line) {
                $product = Product::findOrFail($line['productId']);
                abort_if($product->stock < $line['qty'], 422, "Insufficient stock for {$product->name}.");
                $order->items()->create([
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'quantity' => $line['qty'],
                    'unit_price' => $product->finalPrice(),
                ]);
                $product->decrement('stock', $line['qty']);
                $total += $product->finalPrice() * $line['qty'];
            }
            $order->update(['total' => $total]);

            // Clear this customer's pending cart, if any
            if ($customer) {
                Cart::where('customer_id', $customer->id)->delete();
            }

            return $order;
        });

        return response()->json(['orderId' => $order->number], 201);
    }
}
