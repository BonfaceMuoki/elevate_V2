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
        Schema::table('bonus_payments', function (Blueprint $table) {
            //
            $table->string("used_payment_method")->nullable();
            $table->text("used_wallet")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bonus_payments', function (Blueprint $table) {
            //
            $table->dropColumn("used_payment_method");
            $table->dropColumn("used_wallet");
        });
    }
};
