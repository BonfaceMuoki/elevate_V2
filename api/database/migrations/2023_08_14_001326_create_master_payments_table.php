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
        Schema::create('master_payments', function (Blueprint $table) {
            $table->id();
            $table->string("description")->nullable();
            $table->integer("amount_paid");
            $table->string("payment_proof");
            $table->integer("user_id");
            $table->string("payment_method")->default("unspecified");
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
        Schema::dropIfExists('master_payments');
    }
};
