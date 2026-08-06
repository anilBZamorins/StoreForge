<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /** GET /api/v1/admin/products (ADM-02) — shape matches frontend-admin mock.ts */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->store->products()->with('category')->orderBy('id')->get()
                ->map(fn (Product $p) => $this->transform($p)),
        );
    }

    /** POST /api/v1/admin/products */
    public function store(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $data = $this->validated($request, $store->id);

        $product = $store->products()->create($data);

        return response()->json($this->transform($product->load('category')), 201);
    }

    /** PUT /api/v1/admin/products/{product} */
    public function update(Request $request, Product $product): JsonResponse
    {
        abort_unless($product->store_id === $request->user()->store_id, 404);
        $product->update($this->validated($request, $product->store_id, $product->id));

        return response()->json($this->transform($product->fresh('category')));
    }

    /** DELETE /api/v1/admin/products/{product} */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        abort_unless($product->store_id === $request->user()->store_id, 404);
        $product->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, int $storeId, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'sub' => ['required', 'string'],                 // sub-category slug
            'sku' => ['required', 'string', 'max:40'],
            'price' => ['required', 'integer', 'min:0'],
            'discount' => ['nullable', 'integer', 'min:0', 'max:90'],
            'stock' => ['required', 'integer', 'min:0'],
            'emoji' => ['nullable', 'string', 'max:8'],
            'shortDesc' => ['nullable', 'string', 'max:255'],
            'fullDesc' => ['nullable', 'string'],
        ]);

        $category = Category::where('store_id', $storeId)->where('slug', $data['sub'])
            ->whereNotNull('parent_id')->firstOrFail();

        return [
            'category_id' => $category->id,
            'name' => $data['name'],
            'sku' => $data['sku'],
            'price' => $data['price'],
            'discount_percent' => $data['discount'] ?? 0,
            'stock' => $data['stock'],
            'emoji' => $data['emoji'] ?? '📦',
            'short_description' => $data['shortDesc'] ?? null,
            'description' => $data['fullDesc'] ?? null,
        ];
    }

    private function transform(Product $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'sub' => $p->category->slug,
            'price' => $p->price,
            'discount' => $p->discount_percent,
            'stock' => $p->stock,
            'sku' => $p->sku,
            'emoji' => $p->emoji,
        ];
    }
}
