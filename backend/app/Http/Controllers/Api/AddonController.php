<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function index()
    {
        return Addon::orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required',
        ]);

        $addon = Addon::create([
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => (int) preg_replace('/[^0-9]/', '', $request->price),
            'icon_name'   => $request->icon_name ?? 'sparkles',
            'is_active'   => $request->boolean('is_active', true),
        ]);

        return response()->json($addon, 201);
    }

    public function update(Request $request, Addon $addon)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required',
        ]);

        $addon->update([
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => (int) preg_replace('/[^0-9]/', '', $request->price),
            'icon_name'   => $request->icon_name ?? $addon->icon_name,
            'is_active'   => $request->boolean('is_active', $addon->is_active),
        ]);

        return response()->json($addon->fresh());
    }

    public function destroy(Addon $addon)
    {
        $addon->delete();
        return response()->json(['message' => 'Add-on berhasil dihapus.']);
    }

    public function toggleStatus(Addon $addon)
    {
        $addon->update(['is_active' => !$addon->is_active]);
        return response()->json(['is_active' => $addon->is_active]);
    }
}
