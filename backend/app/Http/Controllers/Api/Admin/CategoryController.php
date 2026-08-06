<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /** GET /api/v1/admin/categories (ADM-03) — parent tree with product counts */
    public function index(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        return response()->json(
            $store->categories()->whereNull('parent_id')->with(['children' => fn ($q) => $q->withCount('products')])
                ->orderBy('id')->get()
                ->map(fn (Category $c) => [
                    'id' => $c->slug,
                    'name' => $c->name,
                    'subs' => $c->children->map(fn (Category $s) => [
                        'id' => $s->slug, 'name' => $s->name, 'count' => $s->products_count,
                    ]),
                ]),
        );
    }

    /** POST /api/v1/admin/categories  {name, description?, parentId?} */
    public function store(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'parentId' => ['nullable', 'string'],            // parent slug for sub-categories
        ]);

        $parent = null;
        if (! empty($data['parentId'])) {
            $parent = $store->categories()->where('slug', $data['parentId'])->whereNull('parent_id')->firstOrFail();
        }

        $category = $store->categories()->create([
            'name' => $data['name'],
            'slug' => $this->uniqueSlug($store->id, $data['name']),
            'description' => $data['description'] ?? null,
            'parent_id' => $parent?->id,
        ]);

        return response()->json(['id' => $category->slug, 'name' => $category->name], 201);
    }

    /** PUT /api/v1/admin/categories/{slug} */
    public function update(Request $request, string $slug): JsonResponse
    {
        $category = $request->user()->store->categories()->where('slug', $slug)->firstOrFail();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);
        $category->update($data);

        return response()->json(['id' => $category->slug, 'name' => $category->name]);
    }

    /** DELETE /api/v1/admin/categories/{slug} */
    public function destroy(Request $request, string $slug): JsonResponse
    {
        $request->user()->store->categories()->where('slug', $slug)->firstOrFail()->delete();

        return response()->json(['ok' => true]);
    }

    private function uniqueSlug(int $storeId, string $name): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $i = 1;
        while (Category::where('store_id', $storeId)->where('slug', $slug)->exists()) {
            $slug = $base . '-' . ++$i;
        }
        return $slug;
    }
}
