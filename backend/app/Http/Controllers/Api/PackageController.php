<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    public function index()
    {
        return Package::orderBy('id')->get()->map(function ($pkg) {
            return $this->formatPackage($pkg);
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required',
            'meta'  => 'nullable|string',
        ]);

        $data = [
            'title'      => $request->title,
            'meta'       => $request->meta,
            'description'=> $request->description,
            'price'      => (int) preg_replace('/[^0-9]/', '', $request->price),
            'is_active'  => $request->boolean('is_active', true),
            'is_special' => $request->boolean('is_special', false),
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('packages', 'public');
        }

        $pkg = Package::create($data);
        return response()->json($this->formatPackage($pkg), 201);
    }

    public function show(Package $package)
    {
        return $this->formatPackage($package);
    }

    public function update(Request $request, Package $package)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required',
        ]);

        $data = [
            'title'      => $request->title,
            'meta'       => $request->meta,
            'description'=> $request->description,
            'price'      => (int) preg_replace('/[^0-9]/', '', $request->price),
            'is_active'  => $request->boolean('is_active', $package->is_active),
            'is_special' => $request->boolean('is_special', $package->is_special),
        ];

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($package->image_path) {
                Storage::disk('public')->delete($package->image_path);
            }
            $data['image_path'] = $request->file('image')->store('packages', 'public');
        }

        $package->update($data);
        return response()->json($this->formatPackage($package->fresh()));
    }

    public function destroy(Package $package)
    {
        if ($package->image_path) {
            Storage::disk('public')->delete($package->image_path);
        }
        $package->delete();
        return response()->json(['message' => 'Paket berhasil dihapus.']);
    }

    public function toggleStatus(Package $package)
    {
        $package->update(['is_active' => !$package->is_active]);
        return response()->json(['is_active' => $package->is_active]);
    }

    private function formatPackage(Package $pkg): array
    {
        return [
            'id'         => $pkg->id,
            'title'      => $pkg->title,
            'meta'       => $pkg->meta,
            'description'=> $pkg->description,
            'price'      => $pkg->price,
            'price_label'=> 'Rp ' . number_format($pkg->price, 0, ',', '.'),
            'image_url'  => $pkg->image_path ? asset('storage/' . $pkg->image_path) : null,
            'is_active'  => $pkg->is_active,
            'is_special' => $pkg->is_special,
        ];
    }
}
