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
        Schema::table('contributions', function (Blueprint $table) {
            //
            $table->integer("current_available_amount_for_sponsorship")->default(0);
            $table->integer("expected_amount_for_sponsorship")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contributions', function (Blueprint $table) {
            //
            $table->dropColumn("current_available_amount_for_sponsorship");
            $table->dropColumn("expected_amount_for_sponsorship");
        });
    }
};
