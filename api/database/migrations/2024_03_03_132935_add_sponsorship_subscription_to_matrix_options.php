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
            //
            $table->integer("living_subscription_amount")->default(0);

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
            
            $table->dropColumn("living_subscription_amount");
        });
    }
};
