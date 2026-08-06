<?php

namespace App\Http\Middleware;

use App\Services\TenantDatabase;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * For Store Admin routes: switches the 'tenant' connection to the
 * authenticated user's store database. Tenant isolation is physical —
 * each store's data lives in its own database (NFR-01).
 */
class UseTenantDatabase
{
    public function handle(Request $request, Closure $next): Response
    {
        $store = $request->user()?->store;

        if (! $store) {
            return response()->json(['message' => 'This account is not attached to a store.'], 403);
        }

        TenantDatabase::use($store);
        $request->attributes->set('store', $store);

        return $next($request);
    }
}
