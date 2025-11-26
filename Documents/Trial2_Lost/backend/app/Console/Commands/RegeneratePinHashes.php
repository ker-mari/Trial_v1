<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class RegeneratePinHashes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pins:regenerate-hashes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate PIN hashes with current bcrypt rounds setting for faster authentication';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Regenerating PIN hashes with BCRYPT_ROUNDS=' . config('hashing.bcrypt.rounds', 10));
        
        // Clear the active pins cache
        Cache::forget('active_pins');
        $this->info('✅ Cleared active pins cache');

        $pins = [
            ['user_name' => 'Mr. Guard 1', 'pin' => env('PIN_GUARD1', '847293')],
            ['user_name' => 'Ms. Guard 2', 'pin' => env('PIN_GUARD2', '562018')],
            ['user_name' => 'Admin User', 'pin' => env('PIN_ADMIN', '391847')],
        ];

        $updated = 0;
        foreach ($pins as $pinData) {
            $newHash = Hash::make($pinData['pin']);
            
            $result = DB::table('pins')
                ->where('user_name', $pinData['user_name'])
                ->update([
                    'pin_hash' => $newHash,
                    'updated_at' => now(),
                ]);

            if ($result) {
                $this->info("✅ Updated hash for: {$pinData['user_name']}");
                $updated++;
            } else {
                $this->warn("⚠️  Could not find user: {$pinData['user_name']}");
            }
        }

        $this->info("\n🎉 Successfully regenerated {$updated} PIN hashes!");
        $this->info('💡 Login should now be significantly faster!');
        
        return Command::SUCCESS;
    }
}

