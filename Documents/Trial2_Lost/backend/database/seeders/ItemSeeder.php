<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;
use Faker\Factory as Faker;

class ItemSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        
        $categories = [
            'Personal Belongings',
            'School Supplies',
            'Clothing',
            'Accessories',
            'Miscellaneous / Others',
            'Documents / Identification',
            'Gadgets / Electronics',
            'Money and Payment Items',
            'Identification and Wallets',
            'Bags and Storage',
            'Jewelry / Valuables'
        ];
        
        $locations = [
            'Entrance Lobby',
            'Lobby 2 (Lost and Found Location)',
            'EFS 1st Floor',
            'EFS 2nd Floor',
            'EFS 3rd Floor',
            'EFS 4th Floor',
            'DSR 1st Floor',
            'DSR 2nd Floor',
            'DSR 3rd Floor',
            'DSR 4th Floor'
        ];
        
        $valuableCategories = [
            'Gadgets / Electronics',
            'Money and Payment Items',
            'Identification and Wallets',
            'Bags and Storage',
            'Jewelry / Valuables'
        ];
        
        for ($i = 0; $i < 1000; $i++) {
            $category = $faker->randomElement($categories);
            $isValuable = in_array($category, $valuableCategories);
            
            Item::create([
                'category' => $category,
                'is_valuable' => $isValuable,
                'location' => $faker->randomElement($locations),
                'date_time' => $faker->dateTimeBetween('-30 days', 'now'),
                'description' => $faker->sentence(8),
                'status' => $faker->randomElement(['available', 'claimed']),
                'finder_name' => $faker->name(),
                'finder_grade' => $faker->randomElement(['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']),
                'finder_id' => $faker->numerify('####-####'),
                'officer' => $faker->randomElement(['Admin', 'Guard 1', 'Guard 2', 'Officer Smith'])
            ]);
        }
    }
}