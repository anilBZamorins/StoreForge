<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** GET /api/v1/admin/dashboard/kpis (ADM-01) */
    public function kpis(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        $orders = $store->orders();
        $weekAgo = now()->subDays(7);

        $totalOrders = (clone $orders)->count();
        $totalSales = (clone $orders)->where('status', '!=', 'Cancelled')->sum('total');
        $pending = (clone $orders)->where('status', 'Pending')->count();
        $newProducts = $store->products()->where('created_at', '>=', $weekAgo)->count();
        $newCustomers = $store->customers()->where('created_at', '>=', $weekAgo)->count();

        $bars = fn () => collect(range(6, 0))->map(fn ($d) => (clone $orders)
            ->whereBetween('placed_at', [now()->subDays($d + 1), now()->subDays($d)])->count() + 1)->values();

        return response()->json([
            ['label' => 'Total Orders', 'value' => (string) $totalOrders, 'delta' => 'All time', 'up' => true, 'icon' => '📦', 'bars' => $bars()],
            ['label' => 'Total Sales', 'value' => '$' . number_format($totalSales), 'delta' => 'All time', 'up' => true, 'icon' => '💰', 'bars' => $bars()],
            ['label' => 'Total Products', 'value' => (string) $store->products()->count(), 'delta' => "+{$newProducts} new this week", 'up' => true, 'icon' => '🏷️', 'bars' => $bars()],
            ['label' => 'Total Customers', 'value' => (string) $store->customers()->count(), 'delta' => "+{$newCustomers} this week", 'up' => true, 'icon' => '🧑', 'bars' => $bars()],
            ['label' => 'Pending Orders', 'value' => (string) $pending, 'delta' => $pending ? 'Needs attention' : 'All clear', 'up' => $pending === 0, 'icon' => '⏳', 'bars' => $bars()],
        ]);
    }
}
