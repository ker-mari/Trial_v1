<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Item;
use Carbon\Carbon;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $officers = ['Mr. Guard 1', 'Ms. Guard 2', 'Admin User'];
        
        $items = [
            [
                'item_no' => '01',
                'category' => 'Electronics',
                'is_valuable' => true,
                'image' => '📱',
                'location' => 'Library',
                'date_time' => '2025-10-10 14:30:00',
                'description' => 'Cellphone na kulay itim. May crack sa screen pero gumagana pa.',
                'officer' => $officers[0]
            ],
            [
                'item_no' => '02',
                'category' => 'Accessories',
                'is_valuable' => false,
                'image' => '🌸',
                'location' => 'Room 205',
                'date_time' => '2025-10-11 09:15:00',
                'description' => 'Hair clip na may design ng bulaklak. Walang sira.',
                'officer' => $officers[1]
            ],
            [
                'item_no' => '03',
                'category' => 'School Supplies',
                'is_valuable' => false,
                'image' => '📚',
                'location' => 'Room 301',
                'date_time' => '2025-10-12 11:20:00',
                'description' => 'Isang set ng pen, lapis, at notebook. Nasa loob ng pencil case na kulay asul.',
                'officer' => $officers[2]
            ],
            [
                'item_no' => '04',
                'category' => 'Accessories',
                'is_valuable' => true,
                'image' => '⌚',
                'location' => 'Gymnasium',
                'date_time' => '2025-10-13 16:45:00',
                'description' => 'Relos na silver. May kaunting gasgas sa gilid.',
                'officer' => $officers[0]
            ],
            [
                'item_no' => '05',
                'category' => 'Personal Belongings',
                'is_valuable' => true,
                'image' => '💼',
                'location' => 'Admin Office',
                'date_time' => '2025-10-14 13:10:00',
                'description' => 'Wallet na itim na may lamang ID at kaunting pera.',
                'officer' => $officers[1]
            ],
            [
                'item_no' => '06',
                'category' => 'Sports Equipments',
                'is_valuable' => false,
                'image' => '🏀',
                'location' => 'Basketball Court',
                'date_time' => '2025-10-15 17:30:00',
                'description' => 'Bola ng basketball. Medyo luma na pero magagamit pa.',
                'officer' => $officers[2]
            ],
            [
                'item_no' => '07',
                'category' => 'Clothing',
                'is_valuable' => false,
                'image' => '🧥',
                'location' => 'Hallway, near CR',
                'date_time' => '2025-10-16 08:45:00',
                'description' => 'Jacket na kulay abo. May tatak na "LVCC" sa likod.',
                'officer' => $officers[0]
            ],
            [
                'item_no' => '08',
                'category' => 'Food and Drinks',
                'is_valuable' => false,
                'image' => '🍱',
                'location' => 'Cafeteria Table 5',
                'date_time' => '2025-10-17 12:00:00',
                'description' => 'Lunch box na may tumbler. May lamang pagkain.',
                'officer' => $officers[1]
            ]
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
        
        // Add items to be cleared (older than 7 days, available status)
        $itemsToBeCleared = [
            [
                'item_no' => '09',
                'category' => 'Personal Belongings',
                'is_valuable' => false,
                'image' => '🧴',
                'location' => 'EFS 2nd Floor',
                'date_time' => now()->subDays(10)->format('Y-m-d H:i:s'),
                'description' => 'Tumbler na kulay puti. May sticker sa gilid.',
                'status' => 'available',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10)
            ],
            [
                'item_no' => '10',
                'category' => 'Accessories',
                'is_valuable' => false,
                'image' => '🧣',
                'location' => 'DSR 1st Floor',
                'date_time' => now()->subDays(8)->format('Y-m-d H:i:s'),
                'description' => 'Handkerchief na may design na bulaklak.',
                'status' => 'available',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8)
            ],
            [
                'item_no' => '11',
                'category' => 'School Supplies',
                'is_valuable' => false,
                'image' => '✏️',
                'location' => 'EFS 3rd Floor',
                'date_time' => now()->subDays(12)->format('Y-m-d H:i:s'),
                'description' => 'Pencil na may eraser sa dulo.',
                'status' => 'available',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12)
            ],
            [
                'item_no' => '12',
                'category' => 'Personal Belongings',
                'is_valuable' => false,
                'image' => '📄',
                'location' => 'DSR 2nd Floor',
                'date_time' => now()->subDays(15)->format('Y-m-d H:i:s'),
                'description' => 'Papel na may sulat. Mukhang assignment.',
                'status' => 'available',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15)
            ],
            [
                'item_no' => '13',
                'category' => 'Accessories',
                'is_valuable' => false,
                'image' => '🪞',
                'location' => 'EFS 4th Floor',
                'date_time' => now()->subDays(9)->format('Y-m-d H:i:s'),
                'description' => 'Maliit na salamin na pang-makeup.',
                'status' => 'available',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(9),
                'updated_at' => now()->subDays(9)
            ]
        ];
        
        foreach ($itemsToBeCleared as $item) {
            Item::create($item);
        }
        
        // Add claimed items for history
        $claimedItems = [
            [
                'item_no' => '14',
                'category' => 'Electronics',
                'is_valuable' => true,
                'image' => '🎧',
                'location' => 'Library',
                'date_time' => now()->subDays(5)->format('Y-m-d H:i:s'),
                'description' => 'Headphones na wireless. May case.',
                'status' => 'claimed',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(2)
            ],
            [
                'item_no' => '15',
                'category' => 'Personal Belongings',
                'is_valuable' => true,
                'image' => '🎒',
                'location' => 'EFS 1st Floor',
                'date_time' => now()->subDays(3)->format('Y-m-d H:i:s'),
                'description' => 'Backpack na kulay itim. May mga libro sa loob.',
                'status' => 'claimed',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(1)
            ],
            [
                'item_no' => '16',
                'category' => 'Accessories',
                'is_valuable' => false,
                'image' => '👓',
                'location' => 'DSR 3rd Floor',
                'date_time' => now()->subDays(6)->format('Y-m-d H:i:s'),
                'description' => 'Eyeglasses na may brown frame.',
                'status' => 'claimed',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(4)
            ],
            [
                'item_no' => '17',
                'category' => 'School Supplies',
                'is_valuable' => false,
                'image' => '📖',
                'location' => 'EFS 2nd Floor',
                'date_time' => now()->subDays(4)->format('Y-m-d H:i:s'),
                'description' => 'Notebook na may tabi. May pangalan sa cover.',
                'status' => 'claimed',
                'officer' => $officers[array_rand($officers)],
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(1)
            ]
        ];
        
        foreach ($claimedItems as $item) {
            Item::create($item);
        }
    }
}
