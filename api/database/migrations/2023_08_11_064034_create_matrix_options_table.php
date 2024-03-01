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
        Schema::create('matrix_options', function (Blueprint $table) {
            $table->id();
            $table->string("tier_name");
            $table->integer("club");
            $table->integer("contribution_amount");
            $table->integer("payback_amount");            
            $table->integer("minimum_progression_count");
            $table->integer("minimum_progression_amount");
            $table->integer("payback_count");
            $table->integer("order_level");
            $table->integer("reinvestment");
            $table->integer("withdrawal");
            $table->integer("subscription_amount");
            $table->integer("elevate_company_amount");
            $table->integer("matrix_amount");
            $table->integer("recruitment_amount");
            $table->integer("bonus_amount");
            $table->timestamps();
            // $table->foreign("club")->references("id")->on("clubs");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matrix_options');
    }
};
