<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@lvcc.edu.ph',
                'password' => Hash::make('admin123')
            ],
            [
                'name' => 'Mr. Guard 1',
                'email' => 'guard1@lvcc.edu.ph',
                'password' => Hash::make('guard123')
            ],
            [
                'name' => 'Ms. Guard 2',
                'email' => 'guard2@lvcc.edu.ph',
                'password' => Hash::make('guard123')
            ]
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}