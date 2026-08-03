<?php

namespace App\Http\Controllers;

use App\Models\Tresorier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function requestOtp(Request $request)
    {
        $request->validate(['telephone' => 'required|string|regex:/^\+221[0-9]{9}$/']);

        $telephone = $request->telephone;

        Tresorier::firstOrCreate(
            ['telephone' => $telephone],
            ['password' => Hash::make('default')]
        );

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put('otp_' . $telephone, $code, 300);

        return response()->json([
            'message' => 'Code envoyé par SMS',
            'telephone' => $telephone,
            'code' => $code,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $telephone = $request->telephone;
        $code = $request->code;

        $storedCode = Cache::get('otp_' . $telephone);

        if (!$storedCode || $storedCode !== $code) {
            return response()->json(['message' => 'Code invalide ou expiré'], 401);
        }

        Cache::forget('otp_' . $telephone);

        $tresorier = Tresorier::where('telephone', $telephone)->first();
        $token = $tresorier->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Authentification réussie',
            'token' => $token,
            'tresorier' => $tresorier,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }
}