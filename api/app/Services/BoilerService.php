<?php

namespace App\Services;
use App\Constants;
use Exception;
use Illuminate\Http\Request;
use App\Models\Supplier;
use DB;

class SupplierService {
    public function saveSupplier(Request $request,$action){
        if($action=="add"){
            try{
                DB::beginTransaction();                
                DB::commit();
            }catch(Exception $exp){
                DB::rollBack();

            }
            return response()->json(['message'=>"saved successfully",'data'=>$request->all()],200);
        }else {

        }
      
    }
}

?>
