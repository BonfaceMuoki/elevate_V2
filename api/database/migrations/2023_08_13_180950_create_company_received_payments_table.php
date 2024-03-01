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
        Schema::create('company_received_payments', function (Blueprint $table) {
            $table->id();
            $table->integer("amount_paid");
            $table->unsignedBigInteger("paid_by");
            $table->unsignedBigInteger("payment_id");
            $table->string("paid_as");
            $table->enum("status",["Pending Approval","Approved"])->default("Pending Approval");
            // $table->string("payment_proof")->nullable();
            $table->text("description")->nullable();
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
        Schema::dropIfExists('company_received_payments');
    }
};
