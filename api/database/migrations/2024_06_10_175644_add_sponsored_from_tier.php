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
        Schema::table('system_user_invites', function (Blueprint $table) {
           $table->unsignedBigInteger("sponsoring_tier_id")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('system_user_invites', function (Blueprint $table) {
            //
            $table->dropColumn("sponsoring_tier_id");
        });
    }
};
