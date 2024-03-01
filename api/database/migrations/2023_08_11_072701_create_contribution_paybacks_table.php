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
        Schema::create('contribution_paybacks', function (Blueprint $table) {
            $table->id();
            $table->integer("contribution_id_reciving_payback");
            $table->integer("contribution_id_paying_payback");
            $table->enum("payment_status",["Pending Verification","Verified"]);
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
        Schema::dropIfExists('contribution_paybacks');
    }
};
