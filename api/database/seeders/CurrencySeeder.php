<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $currencies =
        array(
            array('country_name' => 'South Africa', 'currency_label' => "Rand", 'currency_abreviation' => "RA"),
        );
        // DB::table('currencies')->truncate();
        foreach ($currencies as $currenc) {
            if (Currency::where('country_name', $currenc['country_name'])->where('currency_label', $currenc['currency_label'])->where('currency_abreviation', $currenc['currency_abreviation'])->exists()) {

            } else {
                Currency::create($currenc);
            }
        }
    }
}
