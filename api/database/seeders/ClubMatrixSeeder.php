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
        $clubs = [
            [
                'club_name' => 'club 1',
                'id' => 1,
                'order_level' => 1,
                'tiers' => [
                    [
                        'id' => 1,
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
                        'min_payback_to_sponsor'=>0
                    ],
                    [
                        'id' => 2,
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
                        'recruitment_amount' => 600,
                        'min_payback_to_sponsor'=>210
                    ],
                ],
            ],
            [
                'club_name' => 'club 2',
                'id' => 2,
                'order_level' => 2,
                'tiers' => [
                    [
                        'id' => 3,
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
                    ],
                    [
                        'id' => 4,
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
                    ],
                    [
                        'id' => 5,
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 60,
                        'payback_amount' => 1620,
                        'minimum_progression_count' => 27,
                        'minimum_progression_amount' => 1620,
                        'payback_count' => 27,
                        'order_level' => 3,
                        'withdrawal' => 730,
                        'reinvestment' => 300,
                        'elevate_company_amount' => 290,
                        'matrix_amount' => 60,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 300,
                        'subscription_amount' => 300,
                    ],
                ],
            ],
            [
                'club_name' => 'club 3',
                'id' => 3,
                'order_level' => 3,
                'tiers' => [
                    [
                        'id' => 6,
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
                    ],
                    [
                        'id' => 7,
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
                    ],
                    [
                        'id' => 8,
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
                    ],
                ],
            ],
            [
                'club_name' => 'club 4',
                'id' => 4,
                'order_level' => 4,
                'tiers' => [
                    [
                        'id' => 9,
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
                    ],
                    [
                        'id' => 10,
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
                    ],
                    [
                        'id' => 11,
                        'tier_name' => 'Tier 3',
                        'contribution_amount' => 540,
                        'payback_amount' => 14580,
                        'minimum_progression_count' => 27,
                        'minimum_progression_amount' => 14580,
                        'payback_count' => 27,
                        'order_level' => 3,
                        'withdrawal' => 10400,
                        'reinvestment' => 100,
                        'elevate_company_amount' => 1230,
                        'matrix_amount' => 540,
                        'bonus_amount' => 0,
                        'recruitment_amount' => 2850,
                        'subscription_amount' => 0,
                    ],
                ],
            ],
        ];
        foreach ($clubs as $club) {

            $clubDetails = Club::updateOrCreate(
                ['id' => $club['id']],
                ['club_name' => $club['club_name'],'order_level'=>$club['order_level']]
            );
            
            foreach ($club['tiers'] as $clubTier) {
                $clubTier['club'] = $clubDetails->id;
                MatrixOption::updateOrCreate(
                    ['id' => $clubTier['id']],
                    $clubTier
                );
            }
        

        }
    }
}
