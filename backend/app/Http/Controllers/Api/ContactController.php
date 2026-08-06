<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * POST /api/v1/contact         (platform enquiry — WEB-04)
     * POST /api/v1/store/contact   (tenant storefront enquiry — STF-10, store resolved by middleware)
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

        ContactMessage::create([
            'store_id' => $request->attributes->get('store')?->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'topic' => $data['topic'] ?? null,
            'order_number' => $data['orderNo'] ?? null,
            'message' => $data['message'],
        ]);

        return response()->json(['ok' => true], 201);
    }
}
