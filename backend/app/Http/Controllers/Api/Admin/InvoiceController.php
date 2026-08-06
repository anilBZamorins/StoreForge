<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /** GET /api/v1/admin/invoices (SUB-06) */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->store->invoices()->orderByDesc('issued_at')->get()
                ->map(fn (Invoice $i) => [
                    'id' => $i->number,
                    'date' => $i->issued_at->format('d M Y'),
                    'plan' => $i->plan_name,
                    'amount' => $i->amount,
                    'status' => $i->status,
                ]),
        );
    }
}
