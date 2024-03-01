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
        Schema::create('subscription_links', function (Blueprint $table) {
            $table->id();
            $table->string("link");
            $table->string("owned_by_organisation_name");
            $table->boolean("status")->default(1);
            $table->integer("monthly_subscription_amount")->default(0);
            $table->integer("annual_subscription_amount")->default(0);
            $table->text("description")->nullable();
            $table->unsignedBigInteger("subscription_tier_level");
            $table->softDeletes();
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
        Schema::dropIfExists('subscription_links');
    }
};
