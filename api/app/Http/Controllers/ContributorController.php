<?php

namespace App\Http\Controllers;

use App\Models\BonusPayment;
use App\Models\CompanyReceivedPayment;
use App\Models\Contribution;
use App\Models\ContributorAccount;
use App\Models\MasterPayment;
use App\Models\MatrixOption;
use App\Models\SystemUserInvite;
use App\Models\User;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Validator;

class ContributorController extends Controller
{
    //
    public function invest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paymentProof' => 'required',
            'amount' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Unprocessable data', 'backendvalerrors' => $validator->errors()], 400);
        }
        if (!auth()->check()) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        try {
            DB::beginTransaction();
            //get the tier details
            $matoptions=MatrixOption::where("tier_name","Tier 1")->first();
            //get the tier details
            //upload payment Proof
            $paymentprooffile = $this->uploadPaymentEvidence($request);
            $countcontrionsavailable = Contribution::where('user_id', auth()->user()->id)->count();
            if ($countcontrionsavailable == 0) {
                //save payment
                $savepayment['user_id'] = auth()->user()->id;
                $savepayment['description'] = 'Intial payment of ' . $request->amount;
                $savepayment['payment_proof'] = $paymentprooffile;
                $savepayment['amount_paid'] = $request->amount;
                $masterpayment = MasterPayment::create($savepayment);
                //save payment
                //send to company account
                $companypaymentob['amount_paid'] = ($request->amount) - 40;
                $companypaymentob['paid_by'] = auth()->user()->id;
                $companypaymentob['paid_as'] = 'Initial Investment';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                //send to company account
                //send to matrix
                $tier1 = MatrixOption::where('club', 1)->where('tier_name', 'Tier 1')->first();
                $matrixcontribution['user_id'] = auth()->user()->id;
                $matrixcontribution['tier_id'] = $tier1->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['contribution_amount'] = ($request->amount) - 20;
                $matrixcontribution['payment_id'] = $masterpayment->id;
                $contribution = Contribution::create($matrixcontribution);
                //send to matrix
                //send to bonus
                if (auth()->user()->isAdminInvite == 1) {
                    $companypaymentbob['amount_paid'] = ($request->amount) - 40;
                    $companypaymentbob['paid_by'] = auth()->user()->id;
                    $companypaymentbob['paid_as'] = 'Joining Bonus';
                    $companypaymentbob['payment_method'] = 'Unspecified';
                    $companypaymentbob['payment_id'] = $masterpayment->id;
                    $companypayment = CompanyReceivedPayment::create($companypaymentbob);
                } else {

                    $bonusp['amount_paid'] = ($request->amount) - 40;
                    $bonusp['paid_by'] = auth()->user()->id;
                    $bonusp['bonus_for'] = 'Joining Bonus';
                    $bonusp['payment_id'] = $masterpayment->id;
                    $bonusp = BonusPayment::create($bonusp);

                }
                //send to bonus
                //update investment status

            } else {
                return response()->json([
                    'message' => 'You have already paid your membership fee.',
                ], 201);
            }

            // upload Payment Proof
            DB::commit();

            return response()->json([
                'message' => 'Membership fee payment Made successfully. You will get an email notification once your payment has been verified.Please note that approval might take upto 24hrs.',
            ], 201);

        } catch (\Exception $exp) {
            DB::rollBack();

            return response()->json([
                'message' => 'Request has not been successfully processed.' . $exp->getMessage(),

            ], 400);

        }
    }

    public function uploadPaymentEvidence(Request $request)
    {
        $file = $request->file('paymentProof');
        $fileName = time() . rand(1, 99) . '.' . $file->extension();
        $file->move(public_path('proofs'), $fileName);

        return $fileName;
    }

    public function getMyInvestments()
    {
        if (auth()->check()) {
            $myinvites = Contribution::where('user_id', auth()->user()->id)->with('contributionTier')->get();

            return response()->json($myinvites, 200);

        } else {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }
    }

    public function getMyInvites()
    {
        if (auth()->check()) {
            $myinvites = SystemUserInvite::where('invited_by', auth()->user()->id)->get();

            return response()->json($myinvites, 200);

        } else {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

    }

    public function assignAPayBack($tier, $contribution)
    {

    }

    public function getMyDashboard(Request $request)
    {

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $startDate = Carbon::now()->startOfWeek(); // Start of the current week
        $endDate = Carbon::now()->endOfWeek(); // End of the current week

        $user = auth()->user();

        $allinvites = SystemUserInvite::where('invited_by', $user->id)->count();
        $uncompleted = SystemUserInvite::where('invited_by', $user->id)->where('completed', 0)->count();
        $completed = SystemUserInvite::where('invited_by', $user->id)->where('completed', 1)->count();

        $totalbonus = BonusPayment::join('system_user_invites', 'system_user_invites.completed_user_id', '=', 'bonus_payments.paid_by')
            ->where('system_user_invites.invited_by', $request->user)
            ->where('bonus_payments.status', "Approved")
            ->sum('bonus_payments.amount_paid');

        $totalbonusthismonth = BonusPayment::join('system_user_invites', 'system_user_invites.completed_user_id', '=', 'bonus_payments.paid_by')
            ->where('system_user_invites.invited_by', $request->user)
            ->whereMonth('bonus_payments.created_at', $currentMonth)
            ->where('bonus_payments.status', "Approved")
            ->sum('bonus_payments.amount_paid');
        $totalbonusthisweek = BonusPayment::join('system_user_invites', 'system_user_invites.completed_user_id', '=', 'bonus_payments.paid_by')
            ->where('system_user_invites.invited_by', $request->user)
            ->where('bonus_payments.status', "Approved")
            ->whereBetween('bonus_payments.created_at', [$startDate, $endDate])
            ->sum('bonus_payments.amount_paid');

        return response()->json(
            [
                'totalbBonus' => $totalbonus,
                'totalBonusThisMonth' => $totalbonusthismonth,
                'totalBonusThisWeek' => $totalbonusthisweek,
                'allinvites' => $allinvites,
                'unCompletedInvites' => $uncompleted,
                'completedInvites' => $completed,
            ], 200);

    }

    public function getMyProfileData(Request $request)
    {
        $users = User::with('Invites')
            ->with('payments')
            ->with('MatrixPayments')
            ->with('userSubscriptionLinks')
            ->where('id', $request->user)
            ->first();
        return response()->json($users, 200);
    }
    public function saveWalletID(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|max:255',
            'wallet' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['data' => [], 'message' => Arr::flatten($validator->messages()->get('*')), 'success' => true], 400);
        } else {
            try {
                DB::beginTransaction();
                $saveobject['payment_method'] = $request->method;
                $saveobject['wallet_id'] = $request->wallet;
                $saveobject['user_id'] = auth()->user()->id;
                $created = ContributorAccount::create($saveobject);
                DB::commit();
                return response()->json(['data' => [], 'message' => 'Wallet saved successsfully', 'success' => true], 200);
            } catch (Exception $exp) {

                return response()->json(['data' => [], 'message' => 'Failed.' . $exp->getMessage(), 'success' => true], 200);
                DB::rollback();

            }
        }

    }
}
