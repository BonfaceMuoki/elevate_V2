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
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("tier_id");
            $table->integer("contribution_amount");
            $table->enum("status",["Not Progress and Receiving","Progressed But Receiving","Completed"])->default("Not Progress and Receiving");
            $table->integer("payback_paid_total")->default(0);
            $table->integer("payback_count")->default(0);
            $table->enum("admin_approved",["Pending","Approved"])->default("Pending");
         
   $table->unsignedBigInteger("payment_id");            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contributions');
    }
};
