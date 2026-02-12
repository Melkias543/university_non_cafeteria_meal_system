<?php


namespace App\Http\Controllers\Api;

use Throwable;
use App\Models\Menu;
use App\Models\SystemLog;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\Storage;

class MenuController extends Controller
{
    /**
     * Display a listing of the menu items.
     */
    public function index()
    {
        // Use pagination for professional APIs to prevent memory crashes
        $menus = Menu::latest()->paginate(15);
        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * Store a newly created menu item in storage.
     */

    public function store(Request $request)
    {
        Log::info('Request data: ', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // validate as file
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean'
        ]);

        try {
            return DB::transaction(function () use ($validated, $request) {

                // // Handle image upload
                // if ($request->hasFile('image')) {

                //     $path = $request->file('image')->store('menus', 'public');

                //     $validated['image'] = $path; // store path in DB
                // }

                if ($request->hasFile('image')) {
                    $path = $request->file('image')->store('menus', 'public');
                    $validated['image'] = $path;
                }

                // Ensure boolean type for the database
                $validated['is_available'] = filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN);

                $menu = Menu::create($validated);

                $this->logActivity($request->user()->id, 'created_menu');

                return response()->json([
                    'success' => true,
                    'message' => 'Menu item created successfully',
                    'data' => $menu
                ], 201);
            });
        } catch (\Throwable $e) {
            Log::error("Menu Creation Failed: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server Error'], 500);
        }
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // validate as file
            'price' => 'sometimes|numeric|min:0',
            'is_available' => 'boolean'
        ]);

        try {
            return DB::transaction(function () use ($validated, $request, $menu) {

                // Handle image upload
                if ($request->hasFile('image')) {
                    // Optional: delete old image if exists
                    if ($menu->image) {
                        Storage::disk('public')->delete($menu->image);
                    }

                    $path = $request->file('image')->store('menus', 'public');
                    $validated['image'] = $path;
                }

                $menu->update($validated);

                $this->logActivity($request->user()->id, 'updated_menu');

                return response()->json([
                    'success' => true,
                    'message' => 'Menu item updated successfully',
                    'data' => $menu
                ]);
            });
        } catch (\Throwable $e) {
            Log::error("Menu Update Failed: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Update failed'], 500);
        }
    }

    /**
     * Remove the specified menu item from storage.
     */




    public function destroy(Request $request, Menu $menu)
    {
        try {
            return DB::transaction(function () use ($request, $menu) {
                $menu->delete();

                $this->logActivity($request->user()->id, 'deleted_menu');

                return response()->json([
                    'success' => true,
                    'message' => 'Menu item deleted'
                ]);
            });
        } catch (Throwable $e) {
            Log::error("Menu Deletion Failed: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Deletion failed'], 500);
        }
    }


    public function availability(Request $request, Menu $menu)
    {
        // 1. Validate        
        $validated = $request->validate([
            "is_available" => "required|boolean"
        ]);

        try {
            // Using a simple update check
            $menu->update($validated);
            // Optional logging
            if ($request->user()) {
                $this->logActivity($request->user()->id, 'availability_toggled');
            }

            return response()->json([
                'success' => true,
                'message' => 'Availability updated',
                'data' => $menu
            ]);
        } catch (\Exception $e) {
            // If the DB fails, we still return a JSON response 
            // This prevents the "CORS request did not succeed" status (null) error
            return response()->json([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Private helper to keep logging consistent.
     */
    private function logActivity($userId, $action)
    {
        SystemLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'action' => $action,
        ]);
    }
}
