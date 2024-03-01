<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\MatrixOption;
use Illuminate\Database\Seeder;

class ClubMatrixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $clubs = array(
            array(
                'club_name' => 'club 1',
                'tiers' => array(
                    array(
                        'tier_name' => 'Tier 1',
                        'contribution_amount' => 30,
                        'payback_amount' => 30,
                        'minimum_progression_count' => 2,
                        'minimum_progression_amount' => 20,
                        'payback_count' => 3,
                        'order_level' => 1,
                        'withdrawal' => 10,
                        'reinvestment' => 20,
                        'subscription_amount' => 0,
                        'elevate_company_amount' => 10,
                        'matrix_amount' => 10,
                        'bonus_amount' => 10,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 2',
                        'contribution_amount' => 20,
                        'payback_amount' => 180,
                        'minimum_progression_count' => 2,
                        'minimum_progression_amount' => 40,
                        'payback_count' => 9,
                        'order_level' => 2,
                        'withdrawal' => 10,
                        'reinvestment' => 40,
                        'subscription_amount' => 140,
                        'elevate_company_amount' => 15,
                        'matrix_amount' => 40,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 40,
                        'payback_amount' => 1080,
                        'minimum_progression_count' => 2,
                        'minimum_progression_amount' => 80,
                        'payback_count' => 27,
                        'order_level' => 3,
                        'withdrawal' => 10,
                        'reinvestment' => 80,
                        'elevate_company_amount' => 15,
                        'matrix_amount' => 40,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                        'subscription_amount' => 0,
                    ),
                ),
            ),
        );

        // DB::table('matrix_options')->truncate();
        foreach ($clubs as $club) {
            $createdclub = Club::create(['club_name' => $club['club_name'], 'order_level' => 1]);
            $clubtiers = $club['tiers'];
            foreach ($clubtiers as $clubtier) {

                if (MatrixOption::where('tier_name', $clubtier['tier_name'])->where('club', $createdclub->id)->exists()) {

                } else {
                    $clubtier['club'] = $createdclub->id;
                    MatrixOption::create($clubtier);
                }
            }
        }
    }
}
