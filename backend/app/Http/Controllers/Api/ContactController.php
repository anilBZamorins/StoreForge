<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * POST /api/v1/contact        → landlord DB (platform enquiry, WEB-04)
     * POST /api/v1/store/contact  → the resolved tenant's own DB (STF-10)
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'topic' => ['nullable', 'string', 'max:100'],
            'orderNo' => ['nullable', 'string', 'max:30'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        if ($request->attributes->has('store')) {
            // Tenant connection was set by ResolveStore middleware.
            ContactMessage::on('tenant')->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'order_number' => $data['orderNo'] ?? null,
                'message' => $data['message'],
            ]);
        } else {
            ContactMessage::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'topic' => $data['topic'] ?? null,
                'message' => $data['message'],
            ]);
        }

        return response()->json(['ok' => true], 201);
    }
}
