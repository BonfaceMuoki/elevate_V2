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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("order_owner_id");
            $table->float("total_order_cost");
            $table->float("tax")->default(0.00);
            $table->float("order_balance")->default(0.00);
            $table->enum("payment_status",["UNPAID","PARTIALLY PAID","FULLY PAID"]);
            $table->enum("delivery_status",['RECEIVED','PACKAGING GOING ON','DISPATCHED','ON TRANSIT','PARTIALLY DELIVERED','DELIVERED']);
            $table->text("order_descriptions")->nullable();
            $table->softDeletes();
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
        Schema::dropIfExists('orders');
    }
};
