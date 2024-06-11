<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('matrix_options', function (Blueprint $table) {

            $table->integer("min_payback_to_sponsor")->default(0);
            
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('matrix_options', function (Blueprint $table) { 
           
            $table->dropColumn("min_payback_to_sponsor");
                     
        });
    }
};
