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
                        'minimum_progression_count' => 3,
                        'minimum_progression_amount' => 90,
                        'payback_count' => 3,
                        'order_level' => 1,
                        'withdrawal' => 0,
                        'reinvestment' => 90,
                        'subscription_amount' => 0,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 30,
                        'bonus_amount' => 30,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 2',
                        'contribution_amount' => 90,
                        'payback_amount' => 810,
                        'minimum_progression_count' => 9,
                        'minimum_progression_amount' => 810,
                        'payback_count' => 9,
                        'order_level' => 2,
                        'withdrawal' => 0,
                        'reinvestment' => 100,
                        'subscription_amount' => 0,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 90,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                ),
            ),
            array(
                'club_name' => 'club 2',
                'tiers' => array(
                    array(
                        'tier_name' => 'Tier 1',
                        'contribution_amount' => 15,
                        'payback_amount' => 45,
                        'minimum_progression_count' => 3,
                        'minimum_progression_amount' => 45,
                        'payback_count' => 3,
                        'order_level' => 1,
                        'withdrawal' => 45,
                        'reinvestment' => 0,
                        'subscription_amount' => 15,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 15,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 2',
                        'contribution_amount' => 25,
                        'payback_amount' => 225,
                        'minimum_progression_count' => 9,
                        'minimum_progression_amount' => 225,
                        'payback_count' => 9,
                        'order_level' => 2,
                        'withdrawal' => 225,
                        'reinvestment' => 0,
                        'subscription_amount' => 25,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 25,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 60,
                        'payback_amount' => 1620,
                        'minimum_progression_count' => 27,
                        'minimum_progression_amount' => 1620,
                        'payback_count' => 1620,
                        'order_level' => 3,
                        'withdrawal' => 730,
                        'reinvestment' => 300,
                        'elevate_company_amount' => 290,
                        'matrix_amount' => 60,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                        'subscription_amount' => 300,
                    ),
                ),
            ),
            array(
                'club_name' => 'club 3',
                'tiers' => array(
                    array(
                        'tier_name' => 'Tier 1',
                        'contribution_amount' => 45,
                        'payback_amount' => 135,
                        'minimum_progression_count' => 3,
                        'minimum_progression_amount' => 135,
                        'payback_count' => 3,
                        'order_level' => 1,
                        'withdrawal' => 135,
                        'reinvestment' => 0,
                        'subscription_amount' => 45,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 45,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 2',
                        'contribution_amount' => 75,
                        'payback_amount' => 675,
                        'minimum_progression_count' => 9,
                        'minimum_progression_amount' => 675,
                        'payback_count' => 9,
                        'order_level' => 2,
                        'withdrawal' => 675,
                        'reinvestment' => 0,
                        'subscription_amount' => 75,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 75,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 180,
                        'payback_amount' => 4860,
                        'minimum_progression_count' => 27,
                        'minimum_progression_amount' => 4860,
                        'payback_count' => 27,
                        'order_level' => 3,
                        'withdrawal' => 2860,
                        'reinvestment' => 900,
                        'elevate_company_amount' => 500,
                        'matrix_amount' => 180,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 600,
                        'subscription_amount' => 0,
                    ),
                ),
            ),
            array(
                'club_name' => 'club 4',
                'tiers' => array(
                    array(
                        'tier_name' => 'Tier 1',
                        'contribution_amount' => 135,
                        'payback_amount' => 405,
                        'minimum_progression_count' => 3,
                        'minimum_progression_amount' => 405,
                        'payback_count' => 3,
                        'order_level' => 1,
                        'withdrawal' => 405,
                        'reinvestment' => 0,
                        'subscription_amount' => 135,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 135,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 2',
                        'contribution_amount' => 225,
                        'payback_amount' => 2025,
                        'minimum_progression_count' => 9,
                        'minimum_progression_amount' => 2025,
                        'payback_count' => 9,
                        'order_level' => 2,
                        'withdrawal' => 2025,
                        'reinvestment' => 0,
                        'subscription_amount' => 225,
                        'elevate_company_amount' => 0,
                        'matrix_amount' => 225,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 0,
                    ),
                    array(
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 540,
                        'payback_amount' => 14580,
                        'minimum_progression_count' => 27,
                        'minimum_progression_amount' => 14580,
                        'payback_count' => 27,
                        'order_level' => 3,
                        'withdrawal' => 10400,
                        'reinvestment' => 120,
                        'elevate_company_amount' => 1210,
                        'matrix_amount' => 540,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 2850,
                        'subscription_amount' => 0,
                    ),
                ),
            )
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
