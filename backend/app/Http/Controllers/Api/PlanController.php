<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * GET /api/v1/plans
     * Shape is a superset: frontend-website reads monthlyPrice/features,
     * frontend-admin reads monthly/feats — both are served.
     */
    public function index(): JsonResponse
    {
        return response()->json(Plan::orderBy('monthly_price')->get()->map(fn (Plan $p) => [
            'name' => $p->name,
            'description' => $p->description,
            'monthlyPrice' => $p->monthly_price,
            'yearlyPrice' => $p->yearly_price,
            'monthly' => $p->monthly_price,
            'yearly' => $p->yearly_price,
            'features' => $p->features,
            'feats' => $p->features,
            'featured' => $p->featured,
            'productLimit' => $p->product_limit,
            'adminUserLimit' => $p->admin_user_limit,
            'customDomainLimit' => $p->custom_domain_limit,
        ]));
    }
}
