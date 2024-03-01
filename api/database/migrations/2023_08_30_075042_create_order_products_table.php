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
        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("product_id");
            $table->float("total_product_cost");
            $table->float("total_product_tax")->default(0.00);
            $table->integer("quantity_bought");
            $table->float("total_product_vat");
            $table->enum("payment_status",['UNPAID','PAID']);
            $table->enum("delivery_status",['UNDELIVERED','ON TRANSIT','DELIVERED']);
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
        Schema::dropIfExists('order_products');
    }
};
