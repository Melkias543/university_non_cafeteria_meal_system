<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * 
     */

    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);    
        // User::factory(10)->create();

    $admin =   User::firstOrCreate([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
        ]);


        $admin->assignRole($adminRole); 

    }
}
