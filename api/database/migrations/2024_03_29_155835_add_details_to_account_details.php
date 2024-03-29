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
        Schema::table('contributor_accounts', function (Blueprint $table) {
            //
            $table->string("bank_name")->nullable();
            $table->string("bank_branch_name")->nullable();
            $table->string("bank_account_number")->nullable();
            $table->string("bank_account_holder")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contributor_accounts', function (Blueprint $table) {
            //
            $table->dropColumn("bank_name");
            $table->dropColumn("bank_branch_name");
            $table->dropColumn("bank_account_number");
            $table->dropColumn("bank_account_holder");
        });
    }
};
