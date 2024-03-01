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
        Schema::create('user_subscription_links', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_id");
            $table->unsignedBigInteger("subscriplink_link_id");
            $table->string("link_value")->nullable();
            $table->string("usage_count")->default(0);
            $table->string("owner_subscription_length")->nullable();
            $table->integer("owner_subscription_amount")->nullable();
            $table->enum("status", [
                'Pending Subscription Fee Payment',
                'Subscription Paid and Receiving back Registration',
                'Subscription Paid and Back Registrations Completed'
            ])->default('Pending Subscription Fee Payment');
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
        Schema::dropIfExists('user_subscription_links');
    }
};
