<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    /** GET /api/v1/store/slides (STF-02) — hero slides derived from active banners */
    public function slides(Request $request): JsonResponse
    {
        return response()->json(
            Banner::where('active', true)->orderBy('id')->get()
                ->map(fn (Banner $b) => [
                    'eyebrow' => str_replace(' Banner', '', $b->kind),
                    'title' => $b->title,
                    'sub' => $b->subtitle,
                    'c1' => $b->color1,
                    'c2' => $b->color2,
                ]),
        );
    }

    /** GET /api/v1/store/categories (STF-03) — parent categories with gradient colors */
    public function categories(Request $request): JsonResponse
    {
        $palette = [['#8A6A4E', '#B5673B'], ['#3B2F6C', '#7C9473'], ['#20201C', '#8A6A4E'], ['#0F172A', '#16213E']];

        return response()->json(
            Category::whereNull('parent_id')->orderBy('id')->get()->values()
                ->map(fn (Category $c, int $i) => [
                    'id' => $c->slug,
                    'name' => $c->name,
                    'color1' => $palette[$i % count($palette)][0],
                    'color2' => $palette[$i % count($palette)][1],
                ]),
        );
    }

    /** GET /api/v1/store/products (STF-03/04) — shape matches frontend-storefront mock.ts */
    public function products(Request $request): JsonResponse
    {
        return response()->json(
            Product::query()->with('category')->orderBy('id')->get()
                ->map(fn (Product $p) => $this->transform($p)),
        );
    }

    /** GET /api/v1/store/products/{id} */
    public function product(Request $request, int $id): JsonResponse
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json($this->transform($product));
    }

    private function transform(Product $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'sub' => $p->category->name,        // storefront shows the sub-category label
            'price' => $p->price,
            'discount' => $p->discount_percent,
            'stock' => $p->stock,
            'emoji' => $p->emoji,
            'rating' => $p->rating,
            'featured' => $p->featured,
            'latest' => $p->latest,
            'desc' => $p->description,
        ];
    }
}
