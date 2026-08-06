<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** GET /api/v1/admin/dashboard/kpis (ADM-01) */
    public function kpis(Request $request): JsonResponse
    {
        $orders = Order::query();
        $weekAgo = now()->subDays(7);

        $totalOrders = (clone $orders)->count();
        $totalSales = (clone $orders)->where('status', '!=', 'Cancelled')->sum('total');
        $pending = (clone $orders)->where('status', 'Pending')->count();
        $newProducts = Product::where('created_at', '>=', $weekAgo)->count();
        $newCustomers = Customer::where('created_at', '>=', $weekAgo)->count();

        $bars = fn () => collect(range(6, 0))->map(fn ($d) => (clone $orders)
            ->whereBetween('placed_at', [now()->subDays($d + 1), now()->subDays($d)])->count() + 1)->values();

        return response()->json([
            ['label' => 'Total Orders', 'value' => (string) $totalOrders, 'delta' => 'All time', 'up' => true, 'icon' => '📦', 'bars' => $bars()],
            ['label' => 'Total Sales', 'value' => '$' . number_format($totalSales), 'delta' => 'All time', 'up' => true, 'icon' => '💰', 'bars' => $bars()],
            ['label' => 'Total Products', 'value' => (string) Product::count(), 'delta' => "+{$newProducts} new this week", 'up' => true, 'icon' => '🏷️', 'bars' => $bars()],
            ['label' => 'Total Customers', 'value' => (string) Customer::count(), 'delta' => "+{$newCustomers} this week", 'up' => true, 'icon' => '🧑', 'bars' => $bars()],
            ['label' => 'Pending Orders', 'value' => (string) $pending, 'delta' => $pending ? 'Needs attention' : 'All clear', 'up' => $pending === 0, 'icon' => '⏳', 'bars' => $bars()],
        ]);
    }
}
