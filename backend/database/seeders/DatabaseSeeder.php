<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        // Roles (sanctum guard)
        $adminRole = Role::where('name', 'admin')
            ->where('guard_name', 'sanctum')
            ->firstOrFail();

        $studentRole = Role::where('name', 'student')
            ->where('guard_name', 'sanctum')
            ->firstOrFail();

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'full_name' => 'Admin User',
                'password' => Hash::make('password123'),
            ]
        );

        if (! $admin->hasRole('admin')) {
            $admin->assignRole($adminRole);
        }

        UserProfile::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'phone' => '0000000000',
                'department' => 'Administration',
            ]
        );

        // Student
        $student = User::firstOrCreate(
            ['email' => 'student@gmail.com'],
            [
                'full_name' => 'Student User',
                'password' => Hash::make('password123'),
            ]
        );

        if (! $student->hasRole('student')) {
            $student->assignRole($studentRole);
        }

        UserProfile::firstOrCreate(
            ['user_id' => $student->id],
            [
                'phone' => '1111111111',
                'department' => 'Computer Science',
            ]
        );
    }
}
