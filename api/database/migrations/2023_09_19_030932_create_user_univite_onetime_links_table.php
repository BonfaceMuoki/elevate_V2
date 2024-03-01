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
        Schema::create('user_inivite_onetime_links', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_id");
            $table->text("invite_token");
            $table->integer("invite_count")->default(0);
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
        Schema::dropIfExists('user_inivite_onetime_links');
    }
};
