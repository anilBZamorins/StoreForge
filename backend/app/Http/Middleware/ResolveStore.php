<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Services\TenantDatabase;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the tenant for public storefront routes (STF-*).
 * Priority: X-Store header → ?store= query → {slug}.storeforge.io subdomain.
 * The resolved Store is attached to the request as 'store'.
 */
class ResolveStore
{
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->header('X-Store')
            ?? $request->query('store')
            ?? $this->slugFromHost($request->getHost());

        $store = $slug ? Store::where('slug', $slug)->first() : null;

        if (! $store) {
            return response()->json(['message' => 'Store not found. Pass an X-Store header, ?store= query, or use the store subdomain.'], 404);
        }

        $request->attributes->set('store', $store);

        return $next($request);
    }

    private function slugFromHost(string $host): ?string
    {
        $parts = explode('.', $host);
        if (count($parts) >= 3 && ! in_array($parts[0], ['www', 'admin', 'api'], true)) {
            return $parts[0];
        }
        return null;
    }
}
