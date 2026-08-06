<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * POST /api/v1/auth/login  {email, password, portal: 'store'|'super'}
     * Returns a Sanctum personal access token used as a Bearer token.
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'portal' => ['nullable', 'in:store,super'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }

        $portal = $data['portal'] ?? 'store';
        if ($portal === 'super' && $user->role !== 'super_admin') {
            return response()->json(['message' => 'This account cannot access the Super Admin console.'], 403);
        }
        if ($portal === 'store' && ! in_array($user->role, ['store_owner', 'store_admin'], true)) {
            return response()->json(['message' => 'This account cannot access the Store Admin Dashboard.'], 403);
        }

        $token = $user->createToken($portal . '-portal')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'tenantSlug' => $user->store?->slug,
            ],
        ]);
    }

    /** POST /api/v1/auth/logout — revokes the current token. */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['ok' => true]);
    }

    /** GET /api/v1/auth/me */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'tenantSlug' => $user->store?->slug,
        ]);
    }
}
