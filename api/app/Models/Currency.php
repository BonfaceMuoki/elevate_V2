<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;
    protected $fillable=[
        'currency_label',
        'currency_abreviation',
        'country_name'
    ];
    public function currencySupplierProduct(){
        return $this->hasMany(SupplierProduct::class,"supplier_id");
      }
}
