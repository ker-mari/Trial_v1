<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;
use Faker\Factory as Faker;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        
        $categories = [
            'Personal Belongings', 'School Supplies', 'Clothing', 'Accessories',
            'Miscellaneous / Others', 'Documents / Identification', 
            'Gadgets / Electronics', 'Money and Payment Items',
            'Identification and Wallets', 'Bags and Storage', 'Jewelry / Valuables'
        ];
        
        $locations = [
            'Library', 'Cafeteria', 'Gymnasium', 'Auditorium', 'Parking Lot',
            'Student Center', 'Classroom 101', 'Classroom 102', 'Computer Lab',
            'Science Lab', 'Main Entrance', 'Restroom', 'Hallway', 'Office'
        ];
        
        $officers = ['Bro. Ed', 'Bro. Ramon', 'Mrs. Laura Sabillion'];
        
        for ($i = 1; $i <= 1000; $i++) {
            $category = $faker->randomElement($categories);
            $isValuable = in_array($category, ['Gadgets / Electronics', 'Jewelry / Valuables', 'Money and Payment Items']);
            
            Item::create([
                'item_no' => time() . str_pad($i, 4, '0', STR_PAD_LEFT),
                'category' => $category,
                'is_valuable' => $isValuable,
                'location' => $faker->randomElement($locations),
                'date_time' => $faker->dateTimeBetween('-30 days', 'now'),
                'description' => $faker->sentence(6),
                'status' => $faker->randomElement(['available', 'claimed']),
                'finder_name' => $faker->name(),
                'finder_grade' => $faker->randomElement(['Grade 11', 'Grade 12', 'College 1st Year', 'College 2nd Year']),
                'finder_id' => $faker->numerify('##-####'),
                'officer' => $faker->randomElement($officers),
            ]);
            
            if ($i % 100 == 0) {
                echo "Seeded $i items...\n";
            }
        }
        
        echo "✅ Successfully seeded 1000 items!\n";
    }
}