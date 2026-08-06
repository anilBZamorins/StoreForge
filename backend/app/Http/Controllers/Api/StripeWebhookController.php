<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PendingRegistration;
use App\Models\Plan;
use App\Models\Store;
use App\Services\ProvisionTenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * POST /api/v1/stripe/webhook
     * Configure in the Stripe dashboard (or `stripe listen --forward-to
     * localhost:8000/api/v1/stripe/webhook`). Signature-verified.
     */
    public function handle(Request $request, ProvisionTenant $provisioner): JsonResponse
    {
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
                config('stripe.webhook_secret'),
            );
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->onCheckoutCompleted($event->data->object, $provisioner),
            'invoice.paid' => $this->onInvoicePaid($event->data->object),
            'customer.subscription.deleted' => $this->onSubscriptionDeleted($event->data->object),
            default => null,
        };

        return response()->json(['received' => true]);
    }

    /** Payment done → provision the tenant database + store + owner (PRV-01). */
    private function onCheckoutCompleted(object $session, ProvisionTenant $provisioner): void
    {
        $pending = PendingRegistration::where('stripe_session_id', $session->id)
            ->orWhere('id', (int) ($session->metadata->pending_registration_id ?? 0))
            ->first();

        if (! $pending || $pending->status === 'completed') {
            return;
        }

        try {
            $plan = Plan::where('name', $pending->plan_name)->firstOrFail();

            $result = $provisioner->provision(
                $pending->business_name,
                $pending->owner_name,
                $pending->email,
                null,                                        // password set below from the stored hash
                $plan,
                $pending->billing_cycle,
                trial: false,
                stripeCustomerId: $session->customer ?? null,
                stripeSubscriptionId: $session->subscription ?? null,
            );

            // The owner chose a password at checkout — restore its hash.
            $result['store']->users()->where('email', $pending->email)
                ->update(['password' => $pending->password_hash]);

            $pending->update([
                'status' => 'completed',
                'result' => [
                    'storeUrl' => $result['store']->slug . '.storeforge.io',
                    'adminEmail' => $pending->email,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Tenant provisioning failed: ' . $e->getMessage(), ['pending_id' => $pending->id]);
            $pending->update(['status' => 'failed']);
        }
    }

    /** Recurring payment → record a subscription invoice (SUB-06). */
    private function onInvoicePaid(object $stripeInvoice): void
    {
        $store = Store::where('stripe_customer_id', $stripeInvoice->customer)->first();
        if (! $store) {
            return;
        }

        Invoice::firstOrCreate(
            ['store_id' => $store->id, 'number' => 'INV-' . strtoupper(substr((string) $stripeInvoice->id, -6))],
            [
                'plan_name' => $store->plan->name,
                'amount' => (int) round($stripeInvoice->amount_paid / 100),
                'status' => 'Paid',
                'stripe_invoice_id' => $stripeInvoice->id,
                'issued_at' => now(),
            ],
        );

        $store->update(['status' => 'active']);
    }

    /** Subscription cancelled in Stripe → mark the tenant cancelled. */
    private function onSubscriptionDeleted(object $subscription): void
    {
        Store::where('stripe_subscription_id', $subscription->id)->update(['status' => 'cancelled']);
    }
}
