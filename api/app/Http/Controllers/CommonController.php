<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupplierProductResource;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\ContributionPayback;
use App\Models\ContributorAccount;
use App\Models\MatrixOption;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\SubscriptionLink;
use App\Models\SupplierProduct;
use App\Models\SystemPaymentDetail;
use App\Models\UserSubscriptionLink;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Validator;

class CommonController extends Controller
{
    //
    public function getAllCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }
    public function getAllTiers()
    {
        $tiers = MatrixOption::join('clubs', 'matrix_options.club', '=', 'clubs.id')
            ->select('matrix_options.*', 'clubs.club_name')
            ->get();
        return response()->json($tiers);
    }
    public function getAllProducts(Request $request)
    {
        $products = SupplierProduct::with("supplier", "currency", "category", "productImage");
        if ($request->filled('supplier')) {
            $supplierId = $request->input('supplier');
            $products->Where('supplier_id', $request->supplier);
        }
        if ($request->filled("search")) {
            $products->Where('product_name', 'like', "%$request->search%");
        }
        if ($request->filled("category")) {
            if ($request->category != "All") {
                $products->Where('category_id', $request->category);
            }
        }

        $products->get("*");
        $allrecords = $products->paginate($request->no_records);
        $records = SupplierProductResource::collection($allrecords);
        return $records;
    }
    public function getAllOrderedProducts(Request $request)
    {
        $query = OrderProduct::with("product");
        $query->join("supplier_products", "supplier_products.id", "=", "order_products.product_id");
        if ($request->filled('supplier')) {
            $supplierId = $request->input('supplier');
            $query->where('supplier_products.supplier_id', $supplierId);
        }
        if ($request->filled("search")) {
            $query->where('product_name', 'like', "%$request->search%");
        }
        $allrecords = $query->paginate($request->no_records);
        return $allrecords;
    }
    public function getAllSubLinks()
    {
        $links = SubscriptionLink::with("tier")->get("*");
        return $links;
    }
    public function saveUserRegistrationLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'parent_url' => 'required',
            'your_registration_invite' => 'required|url',
        ]);
        if ($validator->fails()) {
            return response()->json(["message" => Arr::flatten($validator->messages()->get('*'))], 400);
        }
        $parent_link_Details = SubscriptionLink::where("id", $request->parent_url)->first();
        $objecttosave['user_id'] = $request->user;
        $objecttosave['subscriplink_link_id'] = $request->parent_url;
        $objecttosave['link_value'] = $request->your_registration_invite;
        $objecttosave['owner_subscription_length'] = "Annually";
        $objecttosave['owner_subscription_amount'] = $parent_link_Details->annual_subscription_amount;
        if ($request->action == "add") {
            $createdlink = UserSubscriptionLink::create($objecttosave);
            if ($createdlink) {
                return response()->json([
                    'message' => 'Added successfully.',
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Failed to add successfully.',
                ], 200);
            }
        } else if ($request->action == "update") {

        }

    }
    public function getAllUserSubLinks(Request $request)
    {
        $links = UserSubscriptionLink::where("user_id", $request->user)->with("associatedParentLink")->get();
        return response()->json(['links' => $links], 200);
    }
    public function getUserLinkInviteees(Request $request)
    {

        $subscriptiondetails = UserSubscriptionLink::join("subscription_links", "subscription_links.id", "=", "user_subscription_links.subscriplink_link_id")
            ->where("user_subscription_links.id", $request->subscription)->first();
        // return $subscriptiondetails->subscriplink_link_id;
        $contribution = Contribution::where("tier_id", $subscriptiondetails->subscription_tier_level)->where("user_id", $subscriptiondetails->user_id)->first();
        //  return $contribution;
        $paybacks = ContributionPayback::
            join("contributions", "contributions.id", "=", "contribution_paybacks.contribution_id_paying_payback")
            ->join("users", "users.id", "=", "contributions.user_id")
            ->where("contribution_id_reciving_payback", $contribution->id)->select("*")->get();
        return response()->json(['contribution' => $contribution, 'paybacks' => $paybacks], 200);

    }
    public function checkPayBacksBasedOnContribution(Request $request)
    {

        $subscriptiondetails = UserSubscriptionLink::join("subscription_links", "subscription_links.id", "=", "user_subscription_links.subscriplink_link_id")
            ->where("user_subscription_links.id", $request->subscription)->first();
        // return $subscriptiondetails->subscriplink_link_id;
        $contribution = Contribution::where("tier_id", $subscriptiondetails->subscription_tier_level)->where("user_id", $subscriptiondetails->user_id)->first();
        //  return $contribution;
        $paybacks = ContributionPayback::
            join("contributions", "contributions.id", "=", "contribution_paybacks.contribution_id_paying_payback")
            ->join("users", "users.id", "=", "contributions.user_id")
            ->where("contribution_id_reciving_payback", $contribution->id)->select("*")->get();
        return response()->json(['contribution' => $contribution, 'paybacks' => $paybacks], 200);

    }
    public function updatePersonalInformation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|max:255',
            'wallet_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            try {

                DB::beginTransaction();
                $record = null;
                $checkifanotherUserhasthesedetails = ContributorAccount::whereNotIn("user_id", [$request->user])->where("payment_method", $request->payment_methodmethod)->whereIn("wallet_id", [$request->wallet])->count();
                if ($checkifanotherUserhasthesedetails > 0) {
                    return response()->json(['data' => [], 'message' => 'Error Occured.Contact Admin', 'success' => true], 200);
                } else {
                    $checkifaUserhasthesedetails = ContributorAccount::whereIn("user_id", [$request->user])->where("payment_method", $request->payment_methodmethod)->whereIn("wallet_id", [$request->wallet])->count();
                    if ($checkifaUserhasthesedetails > 0) {

                    } else {
                        if ($request->sys == 0) {
                            $found = ContributorAccount::first();
                            $saveobject['payment_method'] = $request->payment_method;
                            $saveobject['wallet_id'] = $request->wallet_id;
                            $saveobject['user_id'] = $request->user;
                            if ($found == null) {
                                $record = ContributorAccount::create($saveobject);
                            } else {
                                $toupdate = ContributorAccount::findOrFail($found->id);
                                $toupdate->update($saveobject);

                                $record = ContributorAccount::first();

                            }

                        } else if ($request->sys == 1) {
                            $found = SystemPaymentDetail::first();
                            $saveobject['payment_method'] = $request->payment_method;
                            $saveobject['wallet_id'] = $request->wallet_id;
                            $saveobject['status'] = 1;
                            if ($found == null) {
                                $record = SystemPaymentDetail::create($saveobject);

                            } else {
                                $toupdate = SystemPaymentDetail::findOrFail($found->id);
                                $toupdate->update($saveobject);
                                $record = SystemPaymentDetail::first();
                            }

                        }

                    }

                }

                DB::commit();
                return response()->json(['data' => [], 'message' => 'Wallet saved successsfully', 'success' => true, 'record' => $record], 200);
            } catch (Exception $exp) {

                return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
                DB::rollback();

            }

        }
    }
    public function saveCart(Request $request)
    {
        $user = auth()->user();
        if (auth()->user() == null) {
            return response()->json(['data' => [], 'message' => 'You are not Logged In. Please Login'], 401);
        }

        try {
            DB::beginTransaction();
            $cartItems = $request->cartItems;
            //save order
            $sum_order = array_reduce($cartItems, function ($carry, $item) {
                return $carry + ($item['quantity'] * $item['price']);
            }, 0);
            $saveorder['order_owner_id'] = $user->id;
            $saveorder['total_order_cost'] = $sum_order;
            $saveorder['order_balance'] = $sum_order;
            $saveorder['payment_status'] = 'UNPAID';
            $saveorder['delivery_status'] = 'RECEIVED';
            $savedorder = Order::create($saveorder);
            //save order
            //save products
            foreach ($cartItems as $cartitem) {
                $saveproduct['order_id'] = $savedorder->id;
                $saveproduct['product_id'] = $cartitem['id'];
                $saveproduct['total_product_cost'] = $cartitem['quantity'] * $cartitem['price'];
                $saveproduct['total_product_tax'] = 0;
                $saveproduct['quantity_bought'] = $cartitem['quantity'];
                $saveproduct['total_product_vat'] = 0;
                $saveproduct['payment_status'] = 'UNPAID';
                $saveproduct['delivery_status'] = 'UNDELIVERED';
                OrderProduct::create($saveproduct);
            }
            $order = Order::where("id", $savedorder->id)->with("orderProducts")->first();
            //save products
            DB::commit();
            return response()->json(['data' => [], 'message' => 'Cart Saved Successfully', 'success' => true, 'record' => $order], 200);
        } catch (Exception $exp) {

            return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
            DB::rollback();

        }

    }
    public function getOrders(Request $request)
    {
        $orders = Order::with("orderProducts", "owner");
        $ords = $orders->paginate($request->no_records);
        return response()->json($ords);
    }
}
