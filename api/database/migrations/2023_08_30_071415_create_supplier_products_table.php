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
        Schema::create('supplier_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("category_id");
            $table->unsignedBigInteger("supplier_id");
            $table->string("product_name");
            $table->string("sku_name")->nullable();
            $table->integer("quantity_available");
            $table->integer("price");
            $table->integer("tax")->default(0);
            $table->integer("currency_id");
            $table->integer("quantity_cap")->default(0);
            $table->boolean("status")->default(1);
            $table->text("about_product")->nullable();
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
        Schema::dropIfExists('supplier_products');
    }
};
