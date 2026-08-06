<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PendingRegistration;
use App\Models\Plan;
use App\Services\ProvisionTenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class RegisterController extends Controller
{
    /**
     * POST /api/v1/register — self-service tenant registration.
     *
     * trial: true  → no card required (BR-03): provisions the tenant database
     *                immediately and returns the credentials.
     * trial: false → creates a Stripe Checkout subscription session and returns
     *                { checkoutUrl }. Provisioning happens in the webhook after
     *                payment; the frontend polls GET /register/status.
     */
    public function store(Request $request, ProvisionTenant $provisioner): JsonResponse
    {
        $data = $request->validate([
            'businessName' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'plan' => ['required', 'exists:plans,name'],
            'billingCycle' => ['nullable', 'in:monthly,yearly'],
            'trial' => ['nullable', 'boolean'],
        ]);

        $plan = Plan::where('name', $data['plan'])->firstOrFail();
        $cycle = $data['billingCycle'] ?? 'monthly';
        $trial = $data['trial'] ?? true;

        // ---------- Free trial: provision immediately ----------
        if ($trial) {
            $result = $provisioner->provision(
                $data['businessName'], $data['name'], $data['email'],
                $data['password'] ?? null, $plan, $cycle, trial: true,
            );

            return response()->json([
                'storeUrl' => $result['store']->slug . '.storeforge.io',
                'adminEmail' => $data['email'],
                'temporaryPassword' => $result['temporaryPassword'],
            ], 201);
        }

        // ---------- Paid: Stripe Checkout, provision on webhook ----------
        $request->validate(['password' => ['required', 'string', 'min:8']]);

        $pending = PendingRegistration::create([
            'business_name' => $data['businessName'],
            'owner_name' => $data['name'],
            'email' => $data['email'],
            'password_hash' => Hash::make($data['password']),
            'plan_name' => $plan->name,
            'billing_cycle' => $cycle,
            'status' => 'awaiting_payment',
        ]);

        Stripe::setApiKey(config('stripe.secret'));

        $amount = ($cycle === 'yearly' ? $plan->yearly_price : $plan->monthly_price) * 100;
        $frontend = rtrim(config('stripe.frontend_url'), '/');

        $session = StripeSession::create([
            'mode' => 'subscription',
            'customer_email' => $data['email'],
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => config('stripe.currency'),
                    'unit_amount' => $amount,
                    'recurring' => ['interval' => $cycle === 'yearly' ? 'year' : 'month'],
                    'product_data' => [
                        'name' => "StoreForge {$plan->name} Plan",
                        'description' => "StoreForge {$plan->name} subscription, billed {$cycle}.",
                    ],
                ],
            ]],
            'metadata' => ['pending_registration_id' => (string) $pending->id],
            'subscription_data' => ['metadata' => ['pending_registration_id' => (string) $pending->id]],
            'success_url' => $frontend . '/register?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontend . '/register?cancelled=1',
        ]);

        $pending->update(['stripe_session_id' => $session->id]);

        return response()->json(['checkoutUrl' => $session->url, 'sessionId' => $session->id]);
    }

    /**
     * GET /api/v1/register/status?session_id=cs_...
     * Polled by the frontend after returning from Stripe Checkout.
     */
    public function status(Request $request): JsonResponse
    {
        $request->validate(['session_id' => ['required', 'string']]);

        $pending = PendingRegistration::where('stripe_session_id', $request->query('session_id'))->firstOrFail();

        return response()->json([
            'status' => $pending->status,                  // awaiting_payment | completed | failed
            'result' => $pending->status === 'completed' ? $pending->result : null,
        ]);
    }
}
