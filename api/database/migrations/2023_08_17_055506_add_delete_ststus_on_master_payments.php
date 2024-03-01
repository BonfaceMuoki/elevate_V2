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
        Schema::table('master_payments', function (Blueprint $table) {
            //
            $table->softDeletes();
            $table->enum("status",["PENDING ADMIN APPROVAL","APPROVED","REJECTED"])->default("PENDING ADMIN APPROVAL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('master_payments', function (Blueprint $table) {
            //
            $table->dropSoftDeletes();
            $table->dropColumn("status");
        });
    }
};
