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
        Schema::create('system_user_invites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("invited_by");
            $table->text("invite_token");
            $table->boolean("completed")->default(0);
            $table->string("registration_link");
            $table->string("invite_name");
            $table->string("invite_email")->unique();
            $table->string("invite_phone");
            $table->string("completed_user_id")->nullable();
            $table->integer("bunus_paid")->default(0);
            $table->dateTime("completed_on")->nullable();
            $table->unsignedBigInteger("completion_user_id")->nullable();
            $table->timestamps();
            $table->foreign('invited_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('system_user_invites');
    }
};
