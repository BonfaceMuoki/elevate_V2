<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
    protected $fillable=[
        'supplier_name',
        'generated_supplier_name',
        'supplier_email',
        'supplier_phone',
        'status',
        'shop_location_descriptions',
        'about_supplier'
    ];
    public function supplierProduct(){
      return $this->hasMany(SupplierProduct::class,"supplier_id");
    }
}
