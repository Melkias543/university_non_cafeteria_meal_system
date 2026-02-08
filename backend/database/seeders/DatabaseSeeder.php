<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void

    {
        // 1️⃣ Create roles if they don't exist
        $adminRole = Role::where('name', 'admin')->first();
        $adminRole = Role::where('name', 'admin')->where('guard_name', 'sanctum')->first();

        // 2️⃣ Create an admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'], // unique field
            [
                'full_name' => 'Admin User',
                'password' => Hash::make('password123'), // change this!
                'role_id' => $adminRole->id,
            ]
        );

        // 3️⃣ Assign the admin role
        $admin->assignRole($adminRole);
        // 4️⃣ Create a user profile for admin (1:1)
        UserProfile::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'photo_url' => null,
                'phone' => '0000000000',
                'department' => 'Administration',
            ]
        );

        // 5️⃣ Optional: create dummy users
        // User::factory(10)->create()->each(function ($user) use ($userRole) {
        //     $user->assignRole($userRole);
        //     UserProfile::factory()->create(['user_id' => $user->id]);
        // });
    }
}
