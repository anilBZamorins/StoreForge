<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /** GET /api/v1/admin/banners (ADM-04) */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->store->banners()->orderBy('id')->get()
                ->map(fn (Banner $b) => $this->transform($b)),
        );
    }

    /** POST /api/v1/admin/banners */
    public function store(Request $request): JsonResponse
    {
        $banner = $request->user()->store->banners()->create($this->validated($request));

        return response()->json($this->transform($banner), 201);
    }

    /** PUT /api/v1/admin/banners/{banner} — also used to toggle active */
    public function update(Request $request, Banner $banner): JsonResponse
    {
        abort_unless($banner->store_id === $request->user()->store_id, 404);
        $banner->update($this->validated($request, partial: true));

        return response()->json($this->transform($banner->fresh()));
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        $data = $request->validate([
            'kind' => [$required, 'in:Homepage Banner,Category Banner,Offer Banner'],
            'title' => [$required, 'string', 'max:100'],
            'sub' => ['nullable', 'string', 'max:150'],
            'color1' => ['nullable', 'string', 'max:9'],
            'color2' => ['nullable', 'string', 'max:9'],
            'active' => ['nullable', 'boolean'],
        ]);

        $mapped = array_filter([
            'kind' => $data['kind'] ?? null,
            'title' => $data['title'] ?? null,
            'subtitle' => $data['sub'] ?? null,
            'color1' => $data['color1'] ?? null,
            'color2' => $data['color2'] ?? null,
        ], fn ($v) => $v !== null);

        if ($request->has('active')) {
            $mapped['active'] = $request->boolean('active');
        }

        return $mapped;
    }

    private function transform(Banner $b): array
    {
        return [
            'id' => $b->id,
            'kind' => $b->kind,
            'title' => $b->title,
            'sub' => $b->subtitle,
            'color1' => $b->color1,
            'color2' => $b->color2,
            'status' => $b->active ? 'Active' : 'Inactive',
        ];
    }
}
