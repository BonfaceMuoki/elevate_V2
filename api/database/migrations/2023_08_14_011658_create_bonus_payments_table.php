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
        Schema::create('bonus_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("paid_by");
            $table->string("bonus_for")->default("invite");
            $table->integer("amount_paid");
            $table->integer("invite_id")->nullable();            
            $table->enum("status",['Pending','Approved'])->default('Pending');
            $table->unsignedBigInteger("payment_id");
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
        Schema::dropIfExists('bonus_payments');
    }
};
