<?php

namespace App\Services;
use App\Constants;
use Exception;
use Illuminate\Http\Request;
use App\Models\SubscriptionLink;
use DB;

class SubscriptionLinksService {
    public function saveLink(Request $request,$action){
             $objecttosave['link']=$request->subscription_link;
             $objecttosave['owned_by_organisation_name']=$request->sponsoring_organization;
             $objecttosave['monthly_subscription_amount']=$request->monthly_subscription;
             $objecttosave['annual_subscription_amount']=$request->annual_subscription;
             $objecttosave['subscription_tier_level']=$request->subscription_tier_level;
             $objecttosave['description']=$request->description;
            try{
                DB::beginTransaction();   
                if($action=="add"){
                    $createdlink=SubscriptionLink::create($objecttosave);
                    DB::commit();                    
                    return response()->json(['message'=>"saved successfully",'created_link'=>SubscriptionLink::get("*")],200);
                }else if($action=="update"){
                    $linktoupdate = SubscriptionLink::findOrFail($request->link);
                    $linktoupdate->update($objecttosave);
                    $updatedlink=SubscriptionLink::where("id",$request->link);
                    DB::commit();
                    return response()->json(['message'=>"Updated successfully",'updated_link'=>$updatedlink],200);
                }         
               
            }catch(Exception $exp){
                DB::rollBack();
                return response()->json(['message'=>"Failed. ".$exp->getMessage()],400);
            }
            
      
      
    }
}

?>
