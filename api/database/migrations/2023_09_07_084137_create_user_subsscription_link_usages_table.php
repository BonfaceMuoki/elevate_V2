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
        Schema::create('user_subsscription_link_usages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("owner");
            $table->unsignedBigInteger("subscriplink_link_id");
            $table->unsignedBigInteger("used_by");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_subsscription_link_usages');
    }
};
